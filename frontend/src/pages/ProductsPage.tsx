import React, { useState } from 'react';
import { useGetProductsQuery } from '../services/productsApi';
import ProductCard from '../components/Products/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FaStar, FaShieldAlt, FaUsers } from 'react-icons/fa';

const ProductsPage: React.FC = () => {
  const [activeFilter] = useState('all');
  // const [searchTerm, setSearchTerm] = useState('');
  // const { data: categoriesData } = useGetCategoriesQuery();
  const { data, isLoading, error } = useGetProductsQuery({ 
    category: activeFilter === 'all' ? undefined : activeFilter, 
    // search: searchTerm 
  });
  // const filterButtons = useMemo(() => {
  //   const base = [{ id: 'all', label: 'ყველა პროდუქტი', icon: FaFilter }];
  //   const mapIcon: Record<string, any> = { fingerprint: FaShieldAlt, faceid: FaStar, combo: FaUsers };
  //   const dynamic = (categoriesData?.categories || []).map((c) => ({
  //     id: c.category,
  //     label: c.category,
  //     icon: mapIcon[c.category] || FaFilter,
  //   }));
  //   return [...base, ...dynamic];
  // }, [categoriesData]);

  // Sync filter with URL query (category)
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const cat = params.get('category');
  //   if (cat && cat !== activeFilter) {
  //     setActiveFilter(cat);
  //   }
  //   const q = params.get('search');
  //   if (q && q !== searchTerm) {
  //     setSearchTerm(q);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.search]);

  // const handleSetFilter = (id: string) => {
  //   setActiveFilter(id);
  //   const params = new URLSearchParams(location.search);
  //   if (id === 'all') {
  //     params.delete('category');
  //   } else {
  //     params.set('category', id);
  //   }
  //   navigate({ search: params.toString() });
  // };

  // Filter products based on search term and category
  // const filteredProducts = data?.products?.filter((product) => {
  //   const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
  //   return matchesSearch && matchesFilter;
  // }) || [];
  
  // Show all products without filtering
  const filteredProducts = data?.products || [];

  if (isLoading) {
    return (
      <div className="min-h-screen dark-section flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error('API Error:', error);
    return (
      <div className="min-h-screen dark-section flex items-center justify-center">
        <div className="glassmorphism-card p-8 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">შეცდომა პროდუქტების ჩატვირთვისას</h2>
          <p className="text-blue-200">გთხოვთ სცადოთ მოგვიანებით</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white">
            ჩვენი მეტალის ხელოვნების კოლექცია
          </h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            აღმოაჩინეთ ჩვენი სრული ასორტიმენტი მეტალის კედლის დეკორაციებისა, რომლებიც 
            <span className="font-bold text-cyan-300"> ხელით დამუშავებული</span> და 
            <span className="font-bold text-purple-300"> ინდივიდუალური დიზაინითაა</span> შექმნილი
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 justify-center mt-8 text-sm">
            <div className="glassmorphism-button px-6 py-3 text-white">
              <FaStar className="inline mr-2 text-yellow-400" />
              ⭐ უნიკალური დიზაინი
            </div>
            <div className="glassmorphism-button px-6 py-3 text-white">
              <FaUsers className="inline mr-2 text-blue-400" />
              👥 ხელით დამუშავებული
            </div>
            <div className="glassmorphism-button px-6 py-3 text-white">
              <FaShieldAlt className="inline mr-2 text-green-400" />
              🛡️ მაღალი ხარისხი
            </div>
          </div>
        </div>

        {/* Search and Filter - Commented out for now */}
        {/* <div className="mb-12">
          <div className="relative max-w-2xl mx-auto mb-8 px-4 sm:px-0">
            <FaSearch className="absolute left-6 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ძიება პროდუქტებში..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glassmorphism-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex justify-center px-4 sm:px-0">
            <div className="glassmorphism-card p-3 sm:p-2 w-full max-w-4xl">
              <div className="hidden md:flex space-x-2 justify-center">
                {filterButtons.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => handleSetFilter(filter.id)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                        activeFilter === filter.id
                          ? 'gradient-primary text-white shadow-lg transform scale-105'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="inline mr-2" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 md:hidden">
                {filterButtons.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => handleSetFilter(filter.id)}
                      className={`px-3 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
                        activeFilter === filter.id
                          ? 'gradient-primary text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="inline mr-1" />
                      <span className="block md:inline">{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div> */}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="glassmorphism-card p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">პროდუქტები ვერ მოიძებნა</h3>
              <p className="text-blue-200 mb-6">პროდუქტები მალე დაემატება</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-blue-200 text-lg">
                <span className="font-bold text-cyan-300">{filteredProducts.length}</span> პროდუქტი
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 mb-16">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="floating-element"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        
      </div>
    </div>
  );
};

export default ProductsPage;
