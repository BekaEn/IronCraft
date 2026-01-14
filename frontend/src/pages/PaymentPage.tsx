import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { FaCreditCard, FaUniversity, FaShieldAlt, FaCheck, FaExclamationTriangle, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  address: string;
  comment: string;
}

type PaymentMethod = 'online' | 'bank_transfer';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentNumber: '',
    address: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
      toast.error('თქვენი კალათა ცარიელია');
    }
  }, [cartItems, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'სახელი აუცილებელია';
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'გვარი აუცილებელია';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'ელ. ფოსტა აუცილებელია';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'ელ. ფოსტის ფორმატი არასწორია';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'ტელეფონის ნომერი აუცილებელია';
    }
    if (!customerInfo.documentNumber.trim()) {
      newErrors.documentNumber = 'პირადობის ნომერი აუცილებელია';
    }
    if (!customerInfo.address.trim()) {
      newErrors.address = 'მისამართი აუცილებელია';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('გთხოვთ შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform cart items to match backend expectations
      const transformedCartItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.isOnSale && item.product.salePrice
          ? parseFloat(String(item.product.salePrice))
          : parseFloat(item.product.price),
        name: item.product.name,
        image: item.product.images?.[0] || ''
      }));

      const orderData = {
        customerInfo,
        cartItems: transformedCartItems,
        total: cartTotal,
        paymentMethod,
        orderDate: new Date().toISOString(),
        status: paymentMethod === 'online' ? 'pending_payment' : 'pending_confirmation'
      };

      // Save order to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('შეკვეთის შენახვა ვერ მოხერხდა');
      }

      const result = await response.json();

      if (paymentMethod === 'online') {
        // For TBC payment, you would redirect to TBC payment page or show iframe
        // For now, we'll simulate successful payment
        toast.success('გადახდა წარმატებით დასრულდა!');
      } else {
        toast.success('შეკვეთა წარმატებით გაიგზავნა! ჩვენ დაგიკავშირდებით მალე.');
      }

      // Clear cart and redirect
      dispatch(clearCart());
      navigate('/order-success', { state: { orderId: result.orderId } });

    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('შეცდომა შეკვეთის გაგზავნისას. გთხოვთ სცადოთ თავიდან.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen dark-section">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="text-white">გადახდა და შეკვეთა</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            აირჩიეთ გადახდის მეთოდი და შეავსეთ ინფორმაცია
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glassmorphism-card p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6">შეკვეთის დეტალები</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 py-3 border-b border-white/10">
                    <img
                      src={item.product.images?.[0]?.startsWith('http') ? item.product.images[0] : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001'}${item.product.images?.[0]}`}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.product.name}</h4>
                      <p className="text-blue-200 text-sm">რაოდენობა: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      {item.product.isOnSale && item.product.salePrice ? (
                        <>
                          <p className="text-white font-bold">{(parseFloat(String(item.product.salePrice)) * item.quantity).toFixed(2)}₾</p>
                          <p className="text-blue-300/70 line-through text-sm">{(parseFloat(item.product.price) * item.quantity).toFixed(2)}₾</p>
                        </>
                      ) : (
                        <p className="text-white font-bold">{(parseFloat(item.product.price) * item.quantity).toFixed(2)}₾</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-white">სულ:</span>
                  <span className="text-lg font-bold text-white mb-2">{cartTotal}₾</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Payment Method Selection */}
              <div className="glassmorphism-card p-6">
                <h3 className="text-2xl font-bold text-white mb-6">აირჩიეთ გადახდის მეთოდი</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    disabled
                    className="p-6 rounded-xl border-2 transition-all duration-300 border-white/10 bg-white/5 text-white/40 cursor-not-allowed relative"
                  >
                    <div className="absolute top-2 right-2 bg-red-500/20 border border-red-400/50 rounded-full px-3 py-1">
                      <span className="text-red-300 text-xs font-bold">მალე</span>
                    </div>
                    <FaCreditCard className="text-3xl mb-4 mx-auto opacity-50" />
                    <h4 className="font-bold text-lg mb-2">ონლაინ გადახდა</h4>
                    <p className="text-sm opacity-50">TBC ბანკის მეშვეობით</p>
                    <p className="text-xs mt-2 text-red-300/70">დროებით მიუწვდომელია</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-green-400 bg-green-400/10 text-green-300'
                        : 'border-white/20 bg-white/5 text-white hover:border-green-400/50'
                    }`}
                  >
                    <FaUniversity className="text-3xl mb-4 mx-auto" />
                    <h4 className="font-bold text-lg mb-2">ბანკის გადარიცხვა</h4>
                    <p className="text-sm opacity-75">BOG ან TBC ანგარიშზე</p>
                  </button>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="glassmorphism-card p-6">
                <h3 className="text-2xl font-bold text-white mb-6">პირადი ინფორმაცია</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">სახელი *</label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.firstName ? 'border-red-400' : ''
                      }`}
                      placeholder="მაგ: ნიკა"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">გვარი *</label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.lastName ? 'border-red-400' : ''
                      }`}
                      placeholder="მაგ: გელაშვილი"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">ელ. ფოსტა *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.email ? 'border-red-400' : ''
                      }`}
                      placeholder="მაგ: nika@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">ტელეფონი *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.phone ? 'border-red-400' : ''
                      }`}
                      placeholder="მაგ: +995555123456"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">პირადობის ნომერი *</label>
                    <input
                      type="text"
                      value={customerInfo.documentNumber}
                      onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                      className={`w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.documentNumber ? 'border-red-400' : ''
                      }`}
                      placeholder="მაგ: 01001001001"
                    />
                    {errors.documentNumber && <p className="text-red-400 text-sm mt-1">{errors.documentNumber}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">მისამართი *</label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.address ? 'border-red-400' : ''
                      }`}
                      placeholder="მაგ: თბილისი, ვაკე, ჭავჭავაძის 12"
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">კომენტარი</label>
                    <textarea
                      value={customerInfo.comment}
                      onChange={(e) => handleInputChange('comment', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 glassmorphism-button text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="დამატებითი ინფორმაცია ან მითითებები..."
                    />
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="glassmorphism-card p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FaUniversity className="mr-3 text-green-400" />
                    ბანკის ანგარიშები
                  </h3>
                  
                  <div className="space-y-6">
                    {/* BOG Account */}
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">Bank of Georgia (BOG)</h4>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Bank_of_Georgia_logo.svg/320px-Bank_of_Georgia_logo.svg.png" alt="BOG" className="h-8 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-blue-200 text-sm mb-1">IBAN:</p>
                          <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 gap-2">
                            <p 
                              className="text-white font-mono text-sm sm:text-base md:text-lg cursor-pointer hover:text-cyan-300 transition-colors flex-1"
                              onClick={() => {
                                navigator.clipboard.writeText('GE00BG0000000000000000');
                                toast.success('IBAN დაკოპირდა!');
                              }}
                              title="დააკლიკეთ კოპირებისთვის"
                            >
                              GE00BG0000000000000000
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('GE00BG0000000000000000');
                                toast.success('IBAN დაკოპირდა!');
                              }}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors flex-shrink-0"
                            >
                              <FaCopy />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm mb-1">მიმღები:</p>
                          <p className="text-white font-medium">IronCraft</p>
                        </div>
                      </div>
                    </div>

                    {/* TBC Account */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">TBC Bank</h4>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/TBC_Bank_logo.svg/320px-TBC_Bank_logo.svg.png" alt="TBC" className="h-8 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-blue-200 text-sm mb-1">IBAN:</p>
                          <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 gap-2">
                            <p 
                              className="text-white font-mono text-sm sm:text-base md:text-lg cursor-pointer hover:text-cyan-300 transition-colors flex-1"
                              onClick={() => {
                                navigator.clipboard.writeText('GE00TB0000000000000000');
                                toast.success('IBAN დაკოპირდა!');
                              }}
                              title="დააკლიკეთ კოპირებისთვის"
                            >
                              GE00TB0000000000000000
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('GE00TB0000000000000000');
                                toast.success('IBAN დაკოპირდა!');
                              }}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors flex-shrink-0"
                            >
                              <FaCopy />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm mb-1">მიმღები:</p>
                          <p className="text-white font-medium">IronCraft</p>
                        </div>
                      </div>
                    </div>

                    {/* Important Instructions */}
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <FaExclamationTriangle className="text-yellow-400 flex-shrink-0 mt-1 text-xl" />
                        <div>
                          <h4 className="text-yellow-300 font-bold text-lg mb-3">მნიშვნელოვანი!</h4>
                          <ul className="text-yellow-200 text-sm space-y-2">
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span><strong>გადარიცხვის დანიშნულებაში აუცილებლად მიუთითეთ თქვენი სახელი და გვარი</strong> (მაგ: "ნიკა გელაშვილი - შეკვეთა")</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>გადარიცხეთ ზუსტად <strong className="text-white">{cartTotal}₾</strong></span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>გადახდის შემდეგ ჩვენ დაგიკავშირდებით 24 საათში დადასტურებისთვის</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>შეინახეთ გადარიცხვის დადასტურება</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TBC Payment iframe (only show when online payment is selected) */}
              {paymentMethod === 'online' && (
                <div className="glassmorphism-card p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FaShieldAlt className="mr-3 text-green-400" />
                    უსაფრთხო გადახდა
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="text-center text-gray-600 py-8">
                      <p className="mb-4">TBC ბანკის გადახდის სისტემა</p>
                      <p className="text-sm text-gray-500">
                        აქ იქნება TBC-ის iframe გადახდის სისტემისთვის
                      </p>
                      {/* TODO: Integrate actual TBC payment iframe */}
                      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded">
                        <p className="text-sm">TBC Payment Integration</p>
                        <p className="text-xs mt-2">iframe will be placed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="glassmorphism-card p-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full gradient-primary text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>დამუშავება...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      <span>
                        {paymentMethod === 'online' ? 'გადახდა' : 'შეკვეთის დადასტურება'}
                      </span>
                    </>
                  )}
                </button>

                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FaExclamationTriangle className="text-blue-400 flex-shrink-0 mt-1" />
                      <div className="text-blue-200 text-sm">
                        <p className="font-medium mb-1">ბანკის გადარიცხვა</p>
                        <p>გადაარიცხეთ თანხა ქვემოთ მოცემულ ანგარიშზე და დაელოდეთ დადასტურებას.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
