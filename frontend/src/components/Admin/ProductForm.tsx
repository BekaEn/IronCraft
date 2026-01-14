import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import type { Product } from '../../services/productsApi';
import { useGetProductVariationsQuery } from '../../services/variationsApi';
import toast from 'react-hot-toast';
import ProductVariationsManager from './ProductVariationsManager';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Partial<Product>) => Promise<Product | void>;
  product?: Product | null; // If provided, we're editing; if null/undefined, we're creating
  title: string;
  submitButtonText: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  title,
  submitButtonText,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: [''],
    price: '',
    category: 'anime' as 'anime' | 'abstract' | 'nature' | 'custom' | 'geometric' | 'portrait' | 'other',
    thumbnail: '',
    features: [''],
    specifications: {
      material: '',
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);

  // Fetch existing variations if editing a product
  const { data: existingVariations } = useGetProductVariationsQuery(
    product?.id || 0,
    { skip: !product?.id }
  );

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        detailedDescription: (product as any).detailedDescription && (product as any).detailedDescription.length > 0 ? (product as any).detailedDescription : [''],
        price: product.price || '',
        category: (product.category || 'anime') as 'anime' | 'abstract' | 'nature' | 'custom' | 'geometric' | 'portrait' | 'other',
        thumbnail: (product as any).thumbnail || '',
        features: product.features?.length > 0 ? product.features : [''],
        specifications: {
          material: product.specifications?.material || '',
        },
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        detailedDescription: [''],
        price: '',
        category: 'anime' as 'anime' | 'abstract' | 'nature' | 'custom' | 'geometric' | 'portrait' | 'other',
        thumbnail: '',
        features: [''],
        specifications: {
          material: '',
        },
      });
    }
  }, [product]);

  // Load existing variations when they are fetched
  useEffect(() => {
    if (existingVariations && existingVariations.length > 0) {
      // Convert API variations to the format expected by ProductVariationsManager
      const formattedVariations = existingVariations
        .filter(v => v.color !== 'Default' && v.size !== 'Standard') // Filter out default variations
        .map(v => ({
          color: v.color,
          size: v.size,
          price: String(v.price),
          salePrice: v.salePrice ? String(v.salePrice) : '',
          images: v.images || [],
        }));
      setVariations(formattedVariations);
    }
  }, [existingVariations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested specifications
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev.specifications,
          [child]: value,
        },
      }));
    } else {
      if (name === 'isOnSale') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, isOnSale: checked }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleArrayChange = (arrayName: string, index: number, value: string) => {
    setFormData(prev => {
      if (arrayName.includes('.')) {
        // Handle nested array (like specifications.unlockMethods)
        const [parent, child] = arrayName.split('.');
        const newArray = [...(prev.specifications as any)[child]];
        newArray[index] = value;
        return {
          ...prev,
          [parent]: {
            ...prev.specifications,
            [child]: newArray,
          },
        };
      } else {
        // Handle top-level array (like features, images)
        const newArray = [...(prev as any)[arrayName]];
        newArray[index] = value;
        return {
          ...prev,
          [arrayName]: newArray,
        };
      }
    });
  };

  const addArrayItem = (arrayName: string) => {
    setFormData(prev => {
      if (arrayName.includes('.')) {
        // Handle nested array
        const [parent, child] = arrayName.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev.specifications,
            [child]: [...(prev.specifications as any)[child], ''],
          },
        };
      } else {
        // Handle top-level array
        return {
          ...prev,
          [arrayName]: [...(prev as any)[arrayName], ''],
        };
      }
    });
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => {
      if (arrayName.includes('.')) {
        // Handle nested array
        const [parent, child] = arrayName.split('.');
        const newArray = (prev.specifications as any)[child].filter((_: any, i: number) => i !== index);
        return {
          ...prev,
          [parent]: {
            ...prev.specifications,
            [child]: newArray.length > 0 ? newArray : [''], // Keep at least one empty item
          },
        };
      } else {
        // Handle top-level array
        const newArray = (prev as any)[arrayName].filter((_: any, i: number) => i !== index);
        return {
          ...prev,
          [arrayName]: newArray.length > 0 ? newArray : [''], // Keep at least one empty item
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Product name is required');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Product description is required');
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Valid price is required');
        return;
      }

      // Clean up empty array items and include variations
      const cleanedData = {
        ...formData,
        price: formData.price, // Keep as string since API expects string
        features: formData.features.filter(f => f.trim() !== ''),
        detailedDescription: formData.detailedDescription.filter(d => d.trim() !== ''),
        specifications: {
          material: formData.specifications.material,
        },
        variations: variations, // Include variations in the product payload
      };

      console.log('📦 Submitting product data with variations:', cleanedData);
      
      const savedProduct = await onSubmit(cleanedData);
      
      console.log('✅ Product saved with variations, response:', savedProduct);
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isSubmitting}
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="anime">ანიმე</option>
                <option value="abstract">აბსტრაქტული</option>
                <option value="nature">ბუნება</option>
                <option value="custom">მორგებული</option>
                <option value="geometric">გეომეტრიული</option>
                <option value="portrait">პორტრეტი</option>
                <option value="other">სხვა</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₾) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                მთავარი სურათი (Thumbnail)
              </label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="სურათის URL ან ფარდობითი მისამართი"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                ეს სურათი გამოჩნდება პროდუქტების სიაში. თუ არ მიუთითებთ, გამოიყენება პირველი ვარიაციის სურათი.
              </p>
            </div>
          </div>

          {/* Product Variations Manager */}
          <ProductVariationsManager 
            productId={product?.id}
            initialVariations={variations}
            onVariationsChange={(newVariations) => {
              setVariations(newVariations);
            }}
          />


          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder="Enter feature"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.features.length === 1}
                >
                  <FaMinus />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
            >
              <FaPlus /> <span>Add Feature</span>
            </button>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              დეტალური აღწერა (ნუმერაციით)
              <span className="text-gray-500 text-xs ml-1">- ყოველი სექცია იწყება emoji-ით (1️⃣, 2️⃣, ⚠️, და ა.შ.)</span>
            </label>
            {formData.detailedDescription.map((section, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-start space-x-2">
                  <textarea
                    value={section}
                    onChange={(e) => handleArrayChange('detailedDescription', index, e.target.value)}
                    placeholder={`${index + 1}️⃣ სექცია ${index + 1}: შეიყვანეთ დეტალური ინფორმაცია...`}
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('detailedDescription', index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                    disabled={formData.detailedDescription.length === 1}
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('detailedDescription')}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
            >
              <FaPlus /> <span>დაამატეთ ახალი სექცია</span>
            </button>
          </div>


          {/* Specifications */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">სპეციფიკაციები</h4>
            <div>
              <label htmlFor="specifications.material" className="block text-sm font-medium text-gray-700 mb-2">
                მასალა
              </label>
              <input
                type="text"
                name="specifications.material"
                value={formData.specifications.material}
                onChange={handleInputChange}
                placeholder="მაგ: მეტალი, ხის მასალა, და ა.შ."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
