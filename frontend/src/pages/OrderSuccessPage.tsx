import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingCart } from 'react-icons/fa';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen dark-section">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8">
            <FaCheckCircle className="text-green-400 text-5xl animate-bounce" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="text-lg font-bold text-white mb-2">შეკვეთა</span>
            <span className="text-white"> წარმატებულია!</span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            თქვენი შეკვეთა წარმატებით მიღებულია. ჩვენ დაგიკავშირდებით მალე დეტალების განსახილველად.
          </p>

          {orderId && (
            <div className="glassmorphism-card p-6 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white mb-2">შეკვეთის ნომერი</h3>
              <p className="text-2xl font-black text-lg font-bold text-white mb-2">{orderId}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="glassmorphism-card p-8 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">შემდეგი ნაბიჯები</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-cyan-300 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">დადასტურება</h4>
                  <p className="text-blue-200 text-sm">ჩვენ დაგიკავშირდებით 1-2 საათში შეკვეთის დასადასტურებლად</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-300 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">მომზადება</h4>
                  <p className="text-blue-200 text-sm">პროდუქტის მომზადება და ინსტალაციის დაგეგმვა</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-300 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">მიტანა</h4>
                  <p className="text-blue-200 text-sm">პროდუქტის მიტანა და უფასო პროფესიონალური ინსტალაცია</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 gradient-primary text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <FaHome className="mr-3" />
              მთავარ გვერდზე დაბრუნება
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 glassmorphism-button text-white font-bold rounded-xl hover:text-cyan-300 transition-all duration-300"
            >
              <FaShoppingCart className="mr-3" />
              სხვა პროდუქტების ნახვა
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 glassmorphism-card p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white mb-4">საკონტაქტო ინფორმაცია</h3>
            <div className="space-y-2 text-blue-200 text-sm">
              <p>📞 ტელეფონი: +995 555 123 456</p>
              <p>📧 ელ. ფოსტა: info@smartlocks.ge</p>
              <p>🕒 სამუშაო საათები: 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
