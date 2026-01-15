import React from 'react';
import { FaShieldAlt, FaTools, FaPaintBrush, FaFire, FaEnvelope, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 dark-section relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 text-white">
            რატომ აირჩიოთ IronCraft?
          </h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            ჩვენ ვქმნით მეტალის კედლის უნიკალურ დეკორაციას — ხელით დამუშავებით და პრემიუმ ხარისხით.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="gradient-primary p-4 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">მაღალი ხარისხის მეტალი</h3>
            <p className="text-blue-200 leading-relaxed">
              გამძლე მეტალი თერმული დაფარვით — ელეგანტური იერი და ხანგრძლივი ხარისხი.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="gradient-accent p-4 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
              <FaTools className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">მარტივი მონტაჟი</h3>
            <p className="text-blue-200 leading-relaxed">
              მონტაჟდება მარტივად და სწრაფად
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="gradient-warning p-4 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
              <FaPaintBrush className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">ინდივიდუალური დიზაინი</h3>
            <p className="text-blue-200 leading-relaxed">
              ექსკლუზიური კოლექციები — ანიმე, აბსტრაქტი, ბუნება და ასევე ინდივიდუალური შეკვეთები.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="gradient-primary p-4 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
              <FaFire className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">თერმული დაფარვა</h3>
            <p className="text-blue-200 leading-relaxed">
              თერმული დაფარვა იცავს ზედაპირს დაზიანებისა და კოროზიისგან, ინარჩუნებს ფერს.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="gradient-accent p-4 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">მარტივი კომუნიკაცია</h3>
            <p className="text-blue-200 leading-relaxed">
              მოგვწერეთ ან დაგვირეკეთ — სიამოვნებით გაგიწევთ კონსულტაციას ნებისმიერ კითხვაზე.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="gradient-warning p-4 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
              <FaStar className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">ხელით დამუშავებული</h3>
            <p className="text-blue-200 leading-relaxed">
              თითოეული ნამუშევარი უნიკალურია — დამზადებულია ყურადღებითა და დეტალებზე ორიენტირებულობით.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glassmorphism-card p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-black mb-6">
              <span className="text-white">მზად ხართ თქვენი </span>
              <span className="text-purple-300">ინტერიერის</span>
              <span className="text-white"> გარდაქმნისთვის?</span>
            </h3>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              შემოუერთდით ასობით კმაყოფილ მომხმარებელს, ვინც IronCraft-ს ენდობა — ინტერიერის გასალამაზებლად.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="gradient-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <FaEnvelope />
                <span>უფასო კონსულტაცია</span>
              </Link>
              <Link
                to="/products"
                className="glassmorphism-button text-white px-8 py-4 rounded-xl font-bold hover:text-cyan-300 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <FaShieldAlt />
                <span>პროდუქტების ნახვა</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;