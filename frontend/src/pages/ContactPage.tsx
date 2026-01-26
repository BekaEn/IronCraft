import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaHeadset, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('გთხოვთ შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    // Validate message length
    if (formData.message.length < 5) {
      toast.error('შეტყობინება უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს');
      return;
    }

    if (formData.message.length > 2000) {
      toast.error('შეტყობინება არ უნდა იყოს 2000 სიმბოლოზე მეტი');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'შეტყობინება წარმატებით გაიგზავნა!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(result.message || 'შეტყობინების გაგზავნისას მოხდა შეცდომა');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error('შეტყობინების გაგზავნისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen dark-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white">
            დაგვიკავშირდით
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            მიიღეთ <span className="font-bold text-cyan-300">უფასო კონსულტაცია</span>, 
            <span className="font-bold text-purple-300"> ინდივიდუალური დიზაინის შეკვეთა</span> ან 
            <span className="font-bold text-green-300"> ფასების ინფორმაცია</span>
          </p>

          {/* Quick Contact Icons */}
          <div className="flex justify-center gap-4 mt-8">
            <a href="tel:+995579105480" className="glassmorphism-button p-4 text-green-400 hover:text-white group">
              <FaPhone className="text-xl group-hover:animate-bounce" />
            </a>
            <a href="https://wa.me/995579105480" className="glassmorphism-button p-4 text-green-500 hover:text-white group">
              <FaWhatsapp className="text-xl group-hover:animate-bounce" />
            </a>
            <a href="mailto:info@ironcraft.ge" className="glassmorphism-button p-4 text-blue-500 hover:text-white group">
              <FaEnvelope className="text-2xl group-hover:animate-bounce" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glassmorphism-card p-8">
            <div className="flex items-center mb-6">
              <div className="gradient-primary p-3 rounded-xl mr-4">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">გამოგვიგზავნეთ შეტყობინება</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  სრული სახელი
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 glassmorphism-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="შეიყვანეთ თქვენი სრული სახელი"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  ელექტრონული ფოსტა
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 glassmorphism-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="შეიყვანეთ თქვენი ელ-ფოსტა"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  ტელეფონის ნომერი
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 glassmorphism-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+995 5XX XXX XXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  თემა
                </label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 glassmorphism-card text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" className="bg-slate-800">აირჩიეთ თემა</option>
                  <option value="sales" className="bg-slate-800">🛒 ყიდვის კონსულტაცია</option>
                  <option value="custom_design" className="bg-slate-800">🎨 ინდივიდუალური დიზაინი</option>
                  <option value="delivery" className="bg-slate-800">🚚 მიწოდების ინფორმაცია</option>
                  <option value="other" className="bg-slate-800">📋 სხვა</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  შეტყობინება
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 glassmorphism-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="გითხარით, როგორ შეგვიძლია დაგეხმაროთ... (მინიმუმ 5 სიმბოლო)"
                  minLength={5}
                  maxLength={2000}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-primary py-4 px-6 rounded-xl text-white font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    იგზავნება...
                  </>
                ) : (
                  <>
                    📨 შეტყობინების გაგზავნა
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="glassmorphism-card p-8">
              <div className="flex items-center mb-6">
                <div className="gradient-accent p-3 rounded-xl mr-4">
                  <FaHeadset className="text-white text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">დაგვიკავშირდით</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="gradient-primary p-4 rounded-xl group-hover:animate-pulse">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">მისამართი</h3>
                    <p className="text-blue-200">ავლაბრის ქუჩა 123, თბილისი, საქართველო 0108</p>
                    <p className="text-sm text-gray-400 mt-1">🕒 ზუსტი ლოკაცია GPS-ით ხელმისაწვდომია</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="gradient-success p-4 rounded-xl group-hover:animate-pulse">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">ტელეფონი</h3>
                    <p className="text-blue-200 font-mono text-lg">+995 579 10 54 80</p>
                    <p className="text-sm text-gray-400 mt-1">📞 სამუშაო საათებში</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="gradient-warning p-4 rounded-xl group-hover:animate-pulse">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">ელ-ფოსტა</h3>
                    <p className="text-blue-200">info@ironcraft.ge</p>
                    <p className="text-sm text-gray-400 mt-1">💌 პასუხი 24 საათში</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="glassmorphism-card p-8">
              <div className="flex items-center mb-6">
                <div className="gradient-primary p-3 rounded-xl mr-4">
                  <FaClock className="text-white text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">სამუშაო საათები</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 glassmorphism-button">
                  <span className="text-blue-200">ორშაბათი - პარასკევი</span>
                  <span className="font-bold text-white">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center p-3 glassmorphism-button">
                  <span className="text-blue-200">შაბათი</span>
                  <span className="font-bold text-white">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between items-center p-3 glassmorphism-button">
                  <span className="text-blue-200">კვირა</span>
                  <span className="font-bold text-red-400">დახურულია</span>
                </div>
                <div className="border-t border-white/20 pt-4 mt-6">
                  <div className="flex justify-between items-center p-3 gradient-success rounded-xl">
                    <span className="text-white font-bold">📧 დაგვიკავშირდით</span>
                    <span className="font-bold text-white">სწრაფი პასუხი</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glassmorphism-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">სწრაფი მოქმედებები</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="tel:+995579105480" className="gradient-primary p-4 rounded-xl text-white font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
                  📞 დარეკვა
                </a>
                <a href="https://wa.me/995579105480" className="gradient-success p-4 rounded-xl text-white font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
                  💬 WhatsApp
                </a>
                <a href="/custom-order" className="gradient-accent p-4 rounded-xl text-white font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
                  🎨 ინდივიდუალური შეკვეთა
                </a>
                <a href="mailto:info@ironcraft.ge" className="gradient-warning p-4 rounded-xl text-white font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
                  📧 ელ-ფოსტა
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 glassmorphism-card p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 text-center">ჩვენი მისამართი</h2>
          <div className="relative h-96 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.8159749653087!2d44.78453931540454!3d41.69411797924233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f626b%3A0x61d084ede2576ea3!2sTbilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            ></iframe>
            <div className="absolute top-4 left-4 glassmorphism-card p-3">
              <p className="text-white font-bold">📍 Smart Locks Georgia</p>
              <p className="text-blue-200 text-sm">ავლაბრის ქუჩა 123, თბილისი</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
