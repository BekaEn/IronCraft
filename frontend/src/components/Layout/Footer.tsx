import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp, FaTelegram, FaShieldAlt, FaClock } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="dark-section border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="gradient-primary p-3 rounded-xl mr-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-3xl font-black text-white">IronCraft</h3>
            </div>
            
            <p className="text-blue-100 mb-6 leading-relaxed text-lg">
              საქართველოში მეტალის კედლის ხელოვნების წამყვანი მიმწოდებელი.
              <span className="font-bold text-cyan-300"> გაამშვენიერეთ თქვენი სივრცე</span> უნიკალური
              <span className="font-bold text-purple-300"> ხელით დამუშავებული</span> და 
              <span className="font-bold text-green-300"> ინდივიდუალური დიზაინის</span> ნამუშევრებით.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="glassmorphism-button px-4 py-2 text-white text-sm">
                🏆 #1 ბრენდი საქართველოში
              </div>
              <div className="glassmorphism-button px-4 py-2 text-white text-sm">
                🎨 ინდივიდუალური დიზაინები
              </div>
              <div className="glassmorphism-button px-4 py-2 text-white text-sm">
                🔥 თერმული საღებავი
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://facebook.com/smartlocksgeorgia" className="glassmorphism-button p-3 text-blue-400 hover:text-white group">
                <FaFacebook className="text-xl group-hover:animate-bounce" />
              </a>
              <a href="https://instagram.com/smartlocksgeorgia" className="glassmorphism-button p-3 text-pink-400 hover:text-white group">
                <FaInstagram className="text-xl group-hover:animate-bounce" />
              </a>
              <a href="https://twitter.com/smartlocksge" className="glassmorphism-button p-3 text-blue-300 hover:text-white group">
                <FaTwitter className="text-xl group-hover:animate-bounce" />
              </a>
              <a href="https://linkedin.com/company/smartlocksgeorgia" className="glassmorphism-button p-3 text-blue-500 hover:text-white group">
                <FaLinkedin className="text-xl group-hover:animate-bounce" />
              </a>
              <a href="https://wa.me/995555123456" className="glassmorphism-button p-3 text-green-400 hover:text-white group">
                <FaWhatsapp className="text-xl group-hover:animate-bounce" />
              </a>
              <a href="https://t.me/smartlocksgeorgia" className="glassmorphism-button p-3 text-blue-400 hover:text-white group">
                <FaTelegram className="text-xl group-hover:animate-bounce" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="text-cyan-300">სწრაფი ბმულები</span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  მთავარი
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  პროდუქტები
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  ჩვენს შესახებ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  კონტაქტი
                </Link>
              </li>
           
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              <span className="gradient-text-accent">კონტაქტი</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="gradient-primary p-2 rounded-lg group-hover:animate-pulse">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">ავლაბრის ქუჩა 123</p>
                  <p className="text-gray-400 text-xs">თბილისი, საქართველო 0108</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="gradient-success p-2 rounded-lg group-hover:animate-pulse">
                  <FaPhone className="text-white text-sm" />
                </div>
                <div>
                  <a href="tel:+995555123456" className="text-blue-200 hover:text-white font-mono">
                    +995 555 123 456
                  </a>
                  <p className="text-gray-400 text-xs">სამუშაო საათებში</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="gradient-warning p-2 rounded-lg group-hover:animate-pulse">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <div>
                  <a href="mailto:info@ironcraft.ge" className="text-blue-200 hover:text-white text-sm">
                    info@ironcraft.ge
                  </a>
                  <p className="text-gray-400 text-xs">პასუხი 24 საათში</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="gradient-accent p-2 rounded-lg group-hover:animate-pulse">
                  <FaClock className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">ორშ-პარ: 09:00-18:00</p>
                  <p className="text-gray-400 text-xs">შაბ: 10:00-16:00</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 glassmorphism-card p-4">
              <p className="text-white font-bold text-sm mb-2">📧 ელ-ფოსტა</p>
              <p className="text-green-300 text-lg">info@ironcraft.ge</p>
              <p className="text-gray-400 text-xs">სწრაფი პასუხი</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-2xl font-bold mb-8 text-center">
            <span className="text-white">ჩვენი </span><span className="text-cyan-300">მომსახურებები</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glassmorphism-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-primary p-3 rounded-xl inline-block mb-4 group-hover:animate-pulse">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">მიწოდება</h4>
              <p className="text-blue-200 text-sm">სწრაფი და უსაფრთხო</p>
            </div>
            
            <div className="glassmorphism-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-success p-3 rounded-xl inline-block mb-4 group-hover:animate-pulse">
                <FaClock className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">მხარდაჭერა</h4>
              <p className="text-blue-200 text-sm">სწრაფი კომუნიკაცია</p>
            </div>
            
            <div className="glassmorphism-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-warning p-3 rounded-xl inline-block mb-4 group-hover:animate-pulse">
                <FaPhone className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">ინდივიდუალური დიზაინი</h4>
              <p className="text-blue-200 text-sm">თქვენი იდეით</p>
            </div>
            
            <div className="glassmorphism-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-accent p-3 rounded-xl inline-block mb-4 group-hover:animate-pulse">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <h4 className="text-white font-bold mb-2">ხარისხი</h4>
              <p className="text-blue-200 text-sm">ხელით დამუშავებული</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2026 <span className="font-bold text-white">IronCraft</span>. ყველა უფლება დაცულია.
              </p>
              <p className="text-gray-500 text-xs">
                შექმნილია ❤️-ით საქართველოში | Made with ❤️ in Georgia
              </p>
            </div>
            
            <div className="flex space-x-6 text-xs">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                კონფიდენციალურობის პოლიტიკა
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                გამოყენების წესები
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies პოლიტიკა
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;