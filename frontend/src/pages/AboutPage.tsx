import React from 'react';
import { FaCog, FaAward, FaHandshake } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            ჩვენს შესახებ
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            საქართველოში #1 მეტალის კედლის ხელოვნების ბრენდი - უნიკალური ხელით დამუშავებული დეკორაციები
          </p>
        </div>

        {/* Company Story */}
        <div className="glassmorphism-card p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-6">
                ჩვენი ისტორია
              </h2>
              <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                2020 წელს დაარსებული IronCraft გახდა რეგიონში მეტალის კედლის ხელოვნების ლიდერი. 
                ჩვენ სპეციალიზდებით ხელით დამუშავებულ მეტალის დეკორაციებზე, ინდივიდუალური დიზაინებზე და უნიკალურ ნამუშევრებზე.
              </p>
              <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                ჩვენი მისიაა თქვენი სივრცე გავხადოთ უნიკალური, მშვენიერი და გამორჩეული. 
                ვჯერებთ, რომ ხელოვნება არის საუკეთესო გზა თქვენი პიროვნების გამოსახატავად.
              </p>
              <p className="text-blue-100 leading-relaxed text-lg">
                ასობით კმაყოფილი მომხმარებელი და ხელოვანებთან თანამშრომლობა - 
                ჩვენ ვაგრძელებთ შემოქმედებას და ვაწვდით ყველაზე ხარისხიან მეტალის ხელოვნების ნამუშევრებს საქართველოში.
              </p>
            </div>
            <div className="glassmorphism-button p-8 text-center">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl sm:text-3xl font-black text-cyan-300 mb-4">ხარისხი პირველ ადგილზე</h3>
              <p className="text-white text-lg leading-relaxed">
                ყოველი პროდუქტი იქმნება ხელით, რათა უზრუნველყოს მაქსიმალური ხარისხი 
                და უნიკალურობა თქვენი სივრცისთვის.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🎨</div>
            <h3 className="text-2xl font-black text-white mb-4">ხელოვნება</h3>
            <p className="text-blue-100 text-lg leading-relaxed">
              ხელით დამუშავებული მეტალის ნამუშევრები თქვენი სივრცის გასამშვენიერებლად
            </p>
          </div>
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">✨</div>
            <h3 className="text-2xl font-black text-white mb-4">უნიკალურობა</h3>
            <p className="text-blue-100 text-lg leading-relaxed">
              ინდივიდუალური დიზაინები და უნიკალური ნამუშევრები თქვენი იდეების მიხედვით
            </p>
          </div>
          <div className="glassmorphism-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🤝</div>
            <h3 className="text-2xl font-black text-white mb-4">მხარდაჭერა</h3>
            <p className="text-blue-100 text-lg leading-relaxed">
              სწრაფი კომუნიკაცია და პროფესიონალური კონსულტაცია
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="glassmorphism-card p-8 mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center text-white mb-12">
            ჩვენი წარმატებები
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-blue-200 text-lg font-semibold">ხელით დამუშავებული</div>
            </div>
            <div className="group">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-blue-200 text-lg font-semibold">უნიკალური დიზაინი</div>
            </div>
            <div className="group">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-blue-200 text-lg font-semibold">ინდივიდუალური შეკვეთები</div>
            </div>
            <div className="group">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-300">🎨</div>
              <div className="text-blue-200 text-lg font-semibold">ხელოვნება</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="glassmorphism-card p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center text-white mb-12">
            რატომ ჩვენ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="glassmorphism-button p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <FaAward className="text-4xl text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">პრემიუმ ხარისხი</h3>
                <p className="text-blue-100">მხოლოდ საუკეთესო ბრენდები და მწარმოებლები</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="glassmorphism-button p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <FaCog className="text-4xl text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">სწრაფი მიწოდება</h3>
                <p className="text-blue-100">უსაფრთხო და სწრაფი მიწოდება მთელი საქართველოს მასშტაბით</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="glassmorphism-button p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <FaHandshake className="text-4xl text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">ინდივიდუალური შეკვეთები</h3>
                <p className="text-blue-100">შექმენით თქვენი საკუთარი უნიკალური დიზაინი</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
