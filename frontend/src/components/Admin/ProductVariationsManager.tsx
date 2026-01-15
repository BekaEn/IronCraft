import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus, FaUpload, FaImage, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

interface Variation {
  color: string;
  size: string;
  price: string;
  salePrice?: string;
  images: string[];
}

interface ProductVariationsManagerProps {
  productId?: number;
  initialVariations?: Variation[];
  onVariationsChange?: (variations: Variation[]) => void;
}

const ProductVariationsManager: React.FC<ProductVariationsManagerProps> = ({
  productId: _productId,
  initialVariations,
  onVariationsChange,
}) => {
  // Predefined color options
  const availableColors = [
    { name: 'შავი', value: 'black', hex: '#000000' },
    { name: 'თეთრი', value: 'white', hex: '#FFFFFF' },
    { name: 'ყვითელი', value: 'yellow', hex: '#FFD700' },
    { name: 'მწვანე', value: 'green', hex: '#22C55E' },
    { name: 'წითელი', value: 'red', hex: '#EF4444' },
    { name: 'ლურჯი', value: 'blue', hex: '#3B82F6' },
    { name: 'ნარინჯისფერი', value: 'orange', hex: '#F97316' },
    { name: 'ვარდისფერი', value: 'pink', hex: '#EC4899' },
    { name: 'იისფერი', value: 'purple', hex: '#A855F7' },
    { name: 'ნაცრისფერი', value: 'gray', hex: '#6B7280' },
    { name: 'ყავისფერი', value: 'brown', hex: '#92400E' },
    { name: 'ოქროსფერი', value: 'gold', hex: '#D4AF37' },
  ];

  const availableSizes = [
    { name: '40x60 სმ', value: '40x60' },
    { name: '60x80 სმ', value: '60x80' },
    { name: '80x120 სმ', value: '80x120' },
    { name: '100x140 სმ', value: '100x140' },
    { name: '120x160 სმ', value: '120x160' },
    { name: '150x200 სმ', value: '150x200' },
  ];

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [showVariationGrid, setShowVariationGrid] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  // Handle image file upload for a variation
  const handleImageUpload = async (color: string, size: string, file: File) => {
    const uploadKey = `${color}-${size}`;
    
    if (!file.type.startsWith('image/')) {
      toast.error('გთხოვთ აირჩიოთ სურათის ფაილი');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/products/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Add uploaded image path to the variation
      const newVariations = variations.map(v => {
        if (v.color === color && v.size === size) {
          // Replace empty string or add new image
          const existingImages = v.images.filter(img => img.trim() !== '');
          return { ...v, images: [...existingImages, data.imagePath] };
        }
        return v;
      });
      
      setVariations(newVariations);
      onVariationsChange?.(newVariations);
      toast.success('სურათი წარმატებით აიტვირთა');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('სურათის ატვირთვა ვერ მოხერხდა');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Load initial variations when provided (editing mode)
  useEffect(() => {
    if (initialVariations && initialVariations.length > 0) {
      setVariations(initialVariations);
      setShowVariationGrid(true);
      
      // Extract unique colors and sizes from initial variations
      const colors = [...new Set(initialVariations.map(v => v.color))];
      const sizes = [...new Set(initialVariations.map(v => v.size))];
      
      setSelectedColors(colors);
      setSelectedSizes(sizes);
    }
  }, [initialVariations]);

  const toggleColor = (colorValue: string) => {
    if (selectedColors.includes(colorValue)) {
      // Remove color
      const newColors = selectedColors.filter(c => c !== colorValue);
      setSelectedColors(newColors);
      // Remove variations with this color
      const newVariations = variations.filter(v => v.color !== colorValue);
      setVariations(newVariations);
      onVariationsChange?.(newVariations);
    } else {
      // Add color
      setSelectedColors([...selectedColors, colorValue]);
    }
  };

  const toggleSize = (sizeValue: string) => {
    if (selectedSizes.includes(sizeValue)) {
      // Remove size
      const newSizes = selectedSizes.filter(s => s !== sizeValue);
      setSelectedSizes(newSizes);
      // Remove variations with this size
      const newVariations = variations.filter(v => v.size !== sizeValue);
      setVariations(newVariations);
      onVariationsChange?.(newVariations);
    } else {
      // Add size
      setSelectedSizes([...selectedSizes, sizeValue]);
    }
  };

  const generateVariations = () => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.error('გთხოვთ აირჩიოთ მინიმუმ 1 ფერი და 1 ზომა');
      return;
    }

    const newVariations: Variation[] = [];
    selectedColors.forEach(color => {
      selectedSizes.forEach(size => {
        // Check if variation already exists
        const existing = variations.find(v => v.color === color && v.size === size);
        if (existing) {
          newVariations.push(existing);
        } else {
          newVariations.push({
            color,
            size,
            price: '',
            salePrice: '',
            images: [''],
          });
        }
      });
    });

    setVariations(newVariations);
    setShowVariationGrid(true);
    onVariationsChange?.(newVariations);
    toast.success(`${newVariations.length} ვარიაცია შეიქმნა`);
  };

  const updateVariation = (color: string, size: string, field: keyof Variation, value: any) => {
    const newVariations = variations.map(v => {
      if (v.color === color && v.size === size) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setVariations(newVariations);
    onVariationsChange?.(newVariations);
  };

  const addVariationImage = (color: string, size: string) => {
    const newVariations = variations.map(v => {
      if (v.color === color && v.size === size) {
        return { ...v, images: [...v.images, ''] };
      }
      return v;
    });
    setVariations(newVariations);
    onVariationsChange?.(newVariations);
  };

  const removeVariationImage = (color: string, size: string, imageIndex: number) => {
    const newVariations = variations.map(v => {
      if (v.color === color && v.size === size) {
        const newImages = v.images.filter((_, i) => i !== imageIndex);
        return { ...v, images: newImages.length > 0 ? newImages : [''] };
      }
      return v;
    });
    setVariations(newVariations);
    onVariationsChange?.(newVariations);
  };

  const updateVariationImage = (color: string, size: string, imageIndex: number, value: string) => {
    const newVariations = variations.map(v => {
      if (v.color === color && v.size === size) {
        const newImages = [...v.images];
        newImages[imageIndex] = value;
        return { ...v, images: newImages };
      }
      return v;
    });
    setVariations(newVariations);
    onVariationsChange?.(newVariations);
  };

  return (
    <div className="space-y-6">
      {/* Colors Section */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">🎨 ფერები (აირჩიეთ)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableColors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color.value)}
              className={`relative flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                selectedColors.includes(color.value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm font-medium text-gray-900">{color.name}</span>
              {selectedColors.includes(color.value) && (
                <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          არჩეულია: {selectedColors.length} ფერი
        </p>
      </div>

      {/* Sizes Section */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">📏 ზომები (აირჩიეთ)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableSizes.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => toggleSize(size.value)}
              className={`relative flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                selectedSizes.includes(size.value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-sm font-medium text-gray-900">{size.name}</span>
              {selectedSizes.includes(size.value) && (
                <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          არჩეულია: {selectedSizes.length} ზომა
        </p>
      </div>

      {/* Generate Variations Button */}
      <div className="border-t pt-6">
        <button
          type="button"
          onClick={generateVariations}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <FaPlus />
          <span>ვარიაციების გენერირება ({selectedColors.length} ფერი × {selectedSizes.length} ზომა)</span>
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          დააჭირეთ ამ ღილაკს ყველა ფერი-ზომის კომბინაციის შესაქმნელად
        </p>
      </div>

      {/* Variations Grid */}
      {showVariationGrid && variations.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            📦 ვარიაციების მართვა ({variations.length} ვარიაცია)
          </h4>
          <div className="space-y-6">
            {variations.map((variation, idx) => (
              <div
                key={`${variation.color}-${variation.size}`}
                className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: availableColors.find(c => c.value === variation.color)?.hex }}
                    />
                    <span>
                      {availableColors.find(c => c.value === variation.color)?.name || variation.color} - {availableSizes.find(s => s.value === variation.size)?.name || variation.size}
                    </span>
                  </h5>
                  <span className="text-sm text-gray-500">#{idx + 1}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ფასი (₾) *
                    </label>
                    <input
                      type="number"
                      value={variation.price}
                      onChange={(e) => updateVariation(variation.color, variation.size, 'price', e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="149.99"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ფასდაკლებული ფასი (₾)
                    </label>
                    <input
                      type="number"
                      value={variation.salePrice || ''}
                      onChange={(e) => updateVariation(variation.color, variation.size, 'salePrice', e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="129.99"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    სურათები ({variation.color} - {variation.size})
                  </label>
                  
                  {/* Uploaded images preview */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {variation.images.filter(img => img.trim() !== '').map((image, imageIdx) => (
                      <div key={imageIdx} className="relative group">
                        <img
                          src={image.startsWith('http') ? image : `${API_BASE.replace('/api', '')}${image}`}
                          alt={`Variation ${imageIdx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Error';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeVariationImage(variation.color, variation.size, imageIdx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Empty state */}
                    {variation.images.filter(img => img.trim() !== '').length === 0 && (
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <FaImage className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(variation.color, variation.size, file);
                          e.target.value = ''; // Reset input
                        }
                      }}
                      className="hidden"
                      id={`upload-${variation.color}-${variation.size}`}
                    />
                    <label
                      htmlFor={`upload-${variation.color}-${variation.size}`}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        uploadingImages[`${variation.color}-${variation.size}`]
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {uploadingImages[`${variation.color}-${variation.size}`] ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span className="text-sm">იტვირთება...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          <span className="text-sm">სურათის ატვირთვა</span>
                        </>
                      )}
                    </label>
                    <span className="text-xs text-gray-500">
                      მაქს. 10MB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariationsManager;
