import React from 'react';
import { Link } from 'react-router-dom';
import { useGetCategoriesQuery, useGetProductsQuery } from '../services/productsApi';
import ProductCard from '../components/Products/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import HeroSection from '../components/Home/HeroSection';
import FeaturesSection from '../components/Home/FeaturesSection';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data, isLoading, error } = useGetProductsQuery({ limit: 8, search: searchTerm || undefined, sortBy: 'sortOrder', sortOrder: 'ASC' });
  const { data: categoriesData } = useGetCategoriesQuery();

  // Debug logging
  console.log('HomePage - data:', data);
  console.log('HomePage - isLoading:', isLoading);
  console.log('HomePage - error:', error);

  return (
    <div className="min-h-screen dark-section">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 dark-section">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              <span className="text-white">რჩეული მეტალის კედლის დეკორაცია</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              აღმოაჩინეთ ჩვენი <span className="font-bold text-cyan-300">უნიკალური მეტალის კედლის დეკორაციები</span>{' '}
              <span className="font-bold text-purple-300">ხელით დამუშავებული დიზაინით</span>.
            </p>
          </div>

          {/* Shop by category inside Featured Products */}
          <div className="py-8">
            <div className="flex flex-wrap gap-2">
              <Link
                to="/products"
                className="px-4 py-2 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm"
              >
                ყველა
              </Link>
              {(categoriesData?.categories || []).map((c) => (
                <Link
                  key={c.category}
                  to={`/products?category=${encodeURIComponent(c.category)}`}
                  className="px-4 py-2 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm"
                >
                  {c.category}
                </Link>
              ))}
            </div>

            {/* Full-width search under categories */}
            <div className="mt-4">
              <div className="relative w-full">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="პროდუქტების ძიება..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                {data?.products?.slice(0, 8).map((product, index) => {
                  // Insert custom order card as 3rd item (index 2)
                  if (index === 2) {
                    return (
                      <React.Fragment key="custom-order-fragment">
                        <Link
                          to="/custom-order"
                          className="floating-element glassmorphism-card overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="relative h-64 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                            <div className="text-center p-6">
                              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center group-hover:animate-pulse">
                                <svg className="w-10 h-10 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                              <h3 className="text-2xl font-black text-white mb-2">ინდივიდუალური შეკვეთა</h3>
                              <p className="text-blue-200 text-sm">ატვირთეთ თქვენი დიზაინი</p>
                            </div>
                          </div>
                          <div className="p-6 bg-gradient-to-b from-transparent to-black/20">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-cyan-300 font-bold text-lg">უნიკალური დიზაინი</span>
                              <span className="gradient-primary px-3 py-1 rounded-full text-white text-xs font-bold">ახალი</span>
                            </div>
                            <p className="text-blue-200 text-sm mb-4">
                              შექმენით თქვენი საკუთარი მეტალის კედლის დეკორაცია. ატვირთეთ სურათი, ზომები და ჩვენ პირადად თქვენთვის შევქმნით პროდუქტს.
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold">დაწყება →</span>
                              <div className="flex gap-2">
                                <span className="text-2xl">🎨</span>
                                <span className="text-2xl">✨</span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div
                          key={product.id}
                          className="floating-element"
                          style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                          <ProductCard product={product} />
                        </div>
                      </React.Fragment>
                    );
                  }

                  return (
                    <div
                      key={product.id}
                      className="floating-element"
                      style={{ animationDelay: `${index < 2 ? index * 100 : (index + 1) * 100}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 gradient-primary text-white font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg"
                >
                  <span>ყველა პროდუქტის ნახვა</span>
                  <svg className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Technology Showcase */}
      <section className="py-16 dark-section">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              <span className="text-white">ხელოვნება და ხარისხი</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              შეიგრძენით <span className="font-bold text-cyan-300">მეტალის ხელოვნების სილამაზე</span> ჩვენი{' '}
              <span className="font-bold text-purple-300">უნიკალური დიზაინებით</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="glassmorphism-card p-6 sm:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-primary w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse">
                <span className="text-2xl sm:text-3xl md:text-4xl">🎨</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-3 sm:mb-4">ხელით დამუშავებული</h3>
              <p className="text-sm sm:text-base text-blue-200 leading-relaxed">
                თითოეული ნამუშევარი <span className="font-bold text-cyan-300">ხელით მუშავდება</span>{' '}
                <span className="font-bold text-green-300">დეტალებზე ყურადღებით</span> — უნიკალური შედეგისთვის.
              </p>
            </div>

            <div className="glassmorphism-card p-6 sm:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-success w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse">
                <span className="text-2xl sm:text-3xl md:text-4xl">💎</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-3 sm:mb-4">პრემიუმ მასალები</h3>
              <p className="text-sm sm:text-base text-blue-200 leading-relaxed">
                <span className="font-bold text-purple-300">მაღალი ხარისხის შავი მეტალი</span> ანტიკოროზიული დაფარვით და{' '}
                <span className="font-bold text-orange-300">მდგრადი კონსტრუქციით</span>.
              </p>
            </div>

            <div className="glassmorphism-card p-6 sm:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="gradient-accent w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse">
                <span className="text-2xl sm:text-3xl md:text-4xl">✨</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-3 sm:mb-4">უნიკალური დიზაინი</h3>
              <p className="text-sm sm:text-base text-blue-200 leading-relaxed">
                <span className="font-bold text-blue-300">ექსკლუზიური კოლექციები</span> — ანიმე, აბსტრაქტული და{' '}
                <span className="font-bold text-green-300">ინდივიდუალური დიზაინები</span> თქვენი სივრცისთვის.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Trust */}
      <section className="py-16 dark-section">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              <span className="text-white">ასობით ადამიანის ნდობა</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              შემოუერთდით <span className="font-bold text-cyan-300">მეტალის ხელოვნების მოყვარულებს</span>{' '}
              <span className="font-bold text-purple-300">საქართველოში</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="glassmorphism-card p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:scale-110 transition-transform duration-300">
                {data?.totalProducts || 0}+
              </div>
              <div className="text-blue-200 font-bold text-xs sm:text-sm md:text-base lg:text-lg">პროდუქტის მოდელი</div>
            </div>

            <div className="glassmorphism-card p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-blue-200 font-bold text-xs sm:text-sm md:text-base lg:text-lg">კმაყოფილი მომხმარებლები</div>
            </div>

            <div className="glassmorphism-card p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 group-hover:animate-pulse">
                99.9%
              </div>
              <div className="text-blue-200 font-bold text-xs sm:text-sm md:text-base lg:text-lg">მდგრადი ხარისხი</div>
            </div>

            <div className="glassmorphism-card p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 group-hover:animate-pulse">
                🎨
              </div>
              <div className="text-blue-200 font-bold text-xs sm:text-sm md:text-base lg:text-lg">ინდივიდუალური დიზაინები</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 dark-section">
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism-card p-6 sm:p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              <span className="text-white">მზად ხართ თქვენი </span>
              <span className="text-purple-300">ინტერიერის</span>
              <br />
              <span className="text-white">გარდაქმნისთვის?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
  შეიგრძენით <span className="font-bold text-cyan-300">მეტალის ხელოვნების სილამაზე</span> და{' '}
  <span className="font-bold text-purple-300">უნიკალური დიზაინები</span>. ასევე შესაძლებელია{' '}
  <span className="font-bold text-green-300">ინდივიდუალური შეკვეთაც</span>.
</p>

<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
  <Link
    to="/products"
    className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 gradient-primary text-white font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg"
  >
    <span>🛒 შეიძინეთ ახლა</span>
  </Link>
  <Link
    to="/contact"
    className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 glassmorphism-button text-white font-bold rounded-2xl hover:text-cyan-300 transition-all duration-300 text-sm sm:text-base md:text-lg"
  >
    <span>📞 მიიღეთ კონსულტაცია</span>
  </Link>
</div>

{/* Trust indicators */}
<div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-8 sm:mt-10">
  <div className="glassmorphism-button px-3 sm:px-4 py-2 text-white text-xs sm:text-sm">✅ ინდივიდუალური შეკვეთა</div>
  <div className="glassmorphism-button px-3 sm:px-4 py-2 text-white text-xs sm:text-sm">🚚 უფასო მიწოდება</div>
  <div className="glassmorphism-button px-3 sm:px-4 py-2 text-white text-xs sm:text-sm">🔥 თერმული დაფარვა</div>
  <div className="glassmorphism-button px-3 sm:px-4 py-2 text-white text-xs sm:text-sm">⭐ ხელით დამუშავებული</div>
</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;