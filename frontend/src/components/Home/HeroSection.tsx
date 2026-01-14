import React from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaTruck, FaUsers, FaStar, FaPlay, FaAward, FaHeart, FaShieldAlt } from 'react-icons/fa';
import PromoBanner from '../UI/PromoBanner';
import { useGetSlidesQuery } from '../../services/heroSlidesApi';

const HeroSection: React.FC = () => {
  // settings removed; hero uses slides only
  const { data: slidesData } = useGetSlidesQuery();
  const slides = (slidesData?.slides || []).filter(s => s.isActive).sort((a, b) => a.order - b.order);
  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    if (slides.length > 1) {
      const id = setInterval(() => {
        setActiveIndex((i) => (i + 1) % slides.length);
      }, 6000);
      return () => clearInterval(id);
    }
  }, [slides.length]);
  
  const getYoutubeEmbedSrc = (rawUrl: string | undefined | null): string | null => {
    if (!rawUrl) return null;
    try {
      const url = new URL(rawUrl);
      let videoId: string | null = null;
      if (url.hostname === 'youtu.be') {
        videoId = url.pathname.split('/')[1] || null;
      }
      if (!videoId && url.searchParams.get('v')) {
        videoId = url.searchParams.get('v');
      }
      if (!videoId && url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2] || null;
      }
      if (!videoId && url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2] || url.pathname.split('/')[1] || null;
      }
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
    } catch {
      const replaced = rawUrl
        .replace('watch?v=', 'embed/')
        .replace('/shorts/', '/embed/');
      return `${replaced}${replaced.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
    }
  };
  // Promo banner now controlled by settings; rotating offers removed

  return (
    <section className="relative bg-background text-white overflow-hidden min-h-screen">
      
      {/* Flash Offer Banner (controlled by settings) */}
      <PromoBanner />
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Top promo pill */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent"></span>
            <span className="text-white/80">უფასო მიწოდება 150 ₾+ შენაძენზე</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content - Marketing Copy */}
          <div className="text-center lg:text-left space-y-8">
            {/* Main Headline (slides only) */}
            <div className="space-y-3 md:space-y-4">
              {slides.length > 0 && (
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white">
                  <span>{slides[activeIndex].title}</span>
                  {slides[activeIndex].subtitle && (
                    <>
                      <br />
                      <span>{slides[activeIndex].subtitle}</span>
                    </>
                  )}
                </h1>
              )}
              
              <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs sm:text-sm md:text-base text-white/80 font-medium">
                <FaShieldAlt className="mr-2 text-xs sm:text-sm" />
                <span className="hidden sm:inline">№1 კედლის დეკორი საქართველოში</span>
              </div>
            </div>

            {/* Value Proposition (from slide description) */}
            {slides[activeIndex]?.description && (
              <p className="text-lg text-white/80 leading-relaxed">
                {slides[activeIndex].description}
              </p>
            )}


            {/* CTA Buttons (slides only) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {slides[activeIndex]?.primaryButtonText && slides[activeIndex]?.primaryButtonUrl && (
                <Link 
                  to={slides[activeIndex].primaryButtonUrl as string} 
                  className="group relative inline-flex items-center justify-center px-6 py-3 rounded-lg shadow-lg overflow-hidden text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">{slides[activeIndex].primaryButtonText}</span>
                  <svg className="ml-2 w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              
              {slides[activeIndex]?.secondaryButtonText && slides[activeIndex]?.secondaryButtonUrl && (
                <Link 
                  to={slides[activeIndex].secondaryButtonUrl as string} 
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/15 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm"
                >
                  <span className="hidden sm:inline">{slides[activeIndex].secondaryButtonText}</span>
                  <span className="sm:hidden">{slides[activeIndex].secondaryButtonText}</span>
                </Link>
              )}
            </div>

            {slides.length > 1 && (
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            )}

            {/* Urgency Timer
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start text-orange-300 font-bold text-sm sm:text-base">
                <div className="flex items-center mb-1 sm:mb-0">
                  <FaClock className="mr-2 animate-pulse text-sm" />
                  <span className="hidden sm:inline">შეთავაზება ამოიწურება:</span>
                  <span className="sm:hidden">ამოიწურება:</span>
                </div>
                <span className="text-yellow-300 text-base sm:text-xl sm:ml-2">2 დღე 14:32:15</span>
              </div>
            </div> */}

          </div>

          {/* Right Content - Media */}
          <div className="relative lg:order-last">
            <div className="relative backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl bg-white/5">
              
              {/* Video/Image Container from slide */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
                {slides[activeIndex]?.youtubeUrl ? (
                  <>
                    <iframe
                      className="w-full h-full object-cover"
                      src={getYoutubeEmbedSrc(slides[activeIndex].youtubeUrl) || ''}
                      title={slides[activeIndex]?.title || 'Promo Video'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <FaPlay className="text-white text-2xl ml-1" />
                      </div>
                    </div>
                  </>
                ) : slides[activeIndex]?.imageUrl ? (
                  <img src={slides[activeIndex].imageUrl || ''} alt={slides[activeIndex]?.title || 'Slide'} className="w-full h-full object-cover" />
                ) : null}
              </div>

              {/* Feature Highlights Around Media */}
              {/* <div className="absolute -top-3 sm:-top-6 -left-3 sm:-left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce">
                <span className="hidden sm:inline">✅ ინსტალაცია 30 წუთში</span>
                <span className="sm:hidden">✅ 30წუთ</span>
              </div>
              
              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce delay-1000">
                <span className="hidden sm:inline">🔐 100% უსაფრთხო</span>
                <span className="sm:hidden">🔐 100%</span>
              </div>
              
              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce delay-2000">
                <span className="hidden sm:inline">📱 სმარტფონის კონტროლი</span>
                <span className="sm:hidden">📱 კონტროლი</span>
              </div>
              
              <div className="absolute -bottom-3 sm:-bottom-6 -right-3 sm:-right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce delay-3000">
                <span className="hidden sm:inline">⚡ მყისიერი წვდომა</span>
                <span className="sm:hidden">⚡ წვდომა</span>
              </div> */}
            </div>

            {/* Floating Security Icons */}
            <div className="absolute top-8 right-4 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <FaPalette className="text-white/70 text-2xl" />
            </div>
            
            <div className="absolute bottom-8 left-4 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
              <FaHeart className="text-white/70 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof & Trust Indicators - Full Width */}
      <div className="w-full bg-white/[0.04] backdrop-blur-sm py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {/* Social Proof Numbers */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaPalette className="text-purple-400 text-lg" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">30+</div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium">უნიკალური დიზაინი</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaTruck className="text-green-400 text-lg" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">უფასო</div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium">მიწოდება</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaUsers className="text-yellow-400 text-lg" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">500+</div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium">კმაყოფილი კლიენტი</div>
            </div>
            
            {/* Trust Indicators - Desktop Only */}
            <div className="hidden lg:block text-center">
              <div className="flex items-center justify-center mb-2">
                <FaStar className="text-yellow-400 text-lg" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">5/5</div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium">★★★★★ შეფასება</div>
            </div>
            <div className="hidden lg:block text-center">
              <div className="flex items-center justify-center mb-2">
                <FaHeart className="text-pink-400 text-lg" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">100%</div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium">ხელნაკეთი ნამუშევარი</div>
            </div>
            <div className="hidden lg:block text-center">
              <div className="flex items-center justify-center mb-2">
                <FaAward className="text-cyan-400 text-lg" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">100%</div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium">ინდივიდუალური შეკვეთა</div>
            </div>
          </div>
        </div>
      </div>

 
      {/* Bottom CTA Strip
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
            <div className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-0">
              <span className="hidden sm:inline">🎯 მხოლოდ დღეს: ყიდვა 2 ჩაკეტი, მიიღეთ მესამე უფასოდ!</span>
              <span className="sm:hidden">🎯 2+1 უფასო შეთავაზება!</span>
            </div>
            <Link 
              to="/products" 
              className="bg-white text-green-600 font-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full hover:bg-green-50 transition-colors duration-300 animate-pulse text-sm sm:text-base"
            >
              <span className="hidden sm:inline">👉 ახლავე ისარგებლეთ შეთავაზებით!</span>
              <span className="sm:hidden">👉 ისარგებლეთ!</span>
            </Link>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;