import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaRuler, FaPhone, FaEnvelope, FaUser, FaHashtag, FaCommentDots } from 'react-icons/fa';
import { useCreateCustomOrderMutation } from '../services/customOrdersApi';

const CustomOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [createCustomOrder, { isLoading }] = useCreateCustomOrderMutation();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    width: '',
    height: '',
    quantity: 1,
    additionalDetails: '',
  });

  const [designImage, setDesignImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, designImage: 'ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს' }));
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, designImage: 'მხოლოდ სურათის ფაილები დაშვებულია (JPEG, PNG, GIF, WEBP)' }));
        return;
      }

      setDesignImage(file);
      setErrors(prev => ({ ...prev, designImage: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'სახელი სავალდებულოა';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ელ-ფოსტა სავალდებულოა';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'არასწორი ელ-ფოსტის ფორმატი';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'ტელეფონი სავალდებულოა';
    }

    if (!formData.width.trim()) {
      newErrors.width = 'სიგანე სავალდებულოა';
    }

    if (!formData.height.trim()) {
      newErrors.height = 'სიმაღლე სავალდებულოა';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'რაოდენობა უნდა იყოს მინიმუმ 1';
    }

    if (!designImage) {
      newErrors.designImage = 'დიზაინის სურათი სავალდებულოა';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('customerName', formData.customerName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('width', formData.width);
    formDataToSend.append('height', formData.height);
    formDataToSend.append('quantity', formData.quantity.toString());
    if (formData.additionalDetails) {
      formDataToSend.append('additionalDetails', formData.additionalDetails);
    }
    if (designImage) {
      formDataToSend.append('designImage', designImage);
    }

    try {
      await createCustomOrder(formDataToSend).unwrap();
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      setErrors({ submit: error.data?.message || 'შეკვეთის გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.' });
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen dark-section flex items-center justify-center px-4 pt-20">
        <div className="glassmorphism-card p-8 md:p-12 max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">შეკვეთა წარმატებით გაიგზავნა!</h2>
          <p className="text-blue-200 text-lg mb-6">
            თქვენი ინდივიდუალური შეკვეთა მიღებულია. ჩვენი გუნდი მალე დაგიკავშირდებათ დეტალების განსახილველად.
          </p>
          <p className="text-blue-300 text-sm">
            გადამისამართება მთავარ გვერდზე...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-section pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            ინდივიდუალური შეკვეთა
          </h1>
          <p className="text-xl text-blue-200">
            ატვირთეთ თქვენი დიზაინი და მიიღეთ უნიკალური მეტალის კედლის ხელოვნება
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glassmorphism-card p-6 md:p-8 space-y-6">
          {/* Design Image Upload */}
          <div>
            <label className="block text-white font-bold mb-3">
              <FaUpload className="inline mr-2" />
              დიზაინის სურათი *
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-cyan-400/50 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setDesignImage(null);
                      setImagePreview('');
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    სურათის წაშლა
                  </button>
                </div>
              ) : (
                <div>
                  <FaUpload className="text-4xl text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-200 mb-2">დააჭირეთ ან გადმოიტანეთ სურათი</p>
                  <p className="text-blue-300 text-sm">JPEG, PNG, GIF, WEBP (მაქს. 10MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="designImage"
              />
              <label
                htmlFor="designImage"
                className="inline-block mt-4 px-6 py-3 gradient-primary text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                ფაილის არჩევა
              </label>
            </div>
            {errors.designImage && <p className="text-red-400 text-sm mt-2">{errors.designImage}</p>}
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-bold mb-2">
                <FaUser className="inline mr-2" />
                სახელი და გვარი *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="თქვენი სახელი"
              />
              {errors.customerName && <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                <FaEnvelope className="inline mr-2" />
                ელ-ფოსტა *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                <FaPhone className="inline mr-2" />
                ტელეფონი *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="+995 XXX XX XX XX"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                <FaHashtag className="inline mr-2" />
                რაოდენობა *
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-bold mb-2">
                <FaRuler className="inline mr-2" />
                სიგანე (სმ) *
              </label>
              <input
                type="text"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="მაგ: 60"
              />
              {errors.width && <p className="text-red-400 text-sm mt-1">{errors.width}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                <FaRuler className="inline mr-2" />
                სიმაღლე (სმ) *
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="მაგ: 40"
              />
              {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-white font-bold mb-2">
              <FaCommentDots className="inline mr-2" />
              დამატებითი დეტალები
            </label>
            <textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="მიუთითეთ დამატებითი დეტალები, სპეციალური მოთხოვნები, ფერები და ა.შ."
            />
          </div>

          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-4 glassmorphism-button text-white font-bold rounded-xl hover:text-cyan-300 transition-all"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-4 gradient-primary text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'იგზავნება...' : 'შეკვეთის გაგზავნა'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomOrderPage;
