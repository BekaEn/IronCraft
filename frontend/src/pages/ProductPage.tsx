import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetProductByIdQuery, useGetProductsQuery } from '../services/productsApi';
import { useGetProductVariationsQuery, type ProductVariation } from '../services/variationsApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FaArrowLeft, FaShoppingCart, FaShieldAlt, FaCheck, FaFire, FaPaintBrush, FaTimes, FaTools, FaSearchPlus, FaSearchMinus, FaBatteryFull, FaWifi } from 'react-icons/fa';
import { useAppDispatch } from '../hooks/redux';
import { addToCart, openCart } from '../store/cartSlice';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';
import ProductVariationSelector from '../components/Products/ProductVariationSelector';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const dispatch = useAppDispatch();
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(id!);
  
  // Fetch product variations
  const { data: variations = [] } = useGetProductVariationsQuery(
    product?.id || 0,
    { skip: !product?.id }
  );
  
  // Fetch similar products from the same category
  const { data: similarProductsData } = useGetProductsQuery(
    { 
      category: product?.category, 
      limit: 4 
    },
    { skip: !product?.category }
  );
  
  // Filter out the current product from similar products
  const similarProducts = similarProductsData?.products?.filter(p => p.id !== product?.id).slice(0, 3) || [];

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${API_BASE}${imagePath}`;
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      dispatch(addToCart({ product, quantity }));
      const variationInfo = selectedVariation ? ` (${selectedVariation.color} - ${selectedVariation.size})` : '';
      toast.success(`${quantity} ცალი ${product.name}${variationInfo} კალათაში დაემატა!`);
      dispatch(openCart());
    } else {
      toast.error('გთხოვთ აირჩიოთ სწორი რაოდენობა');
    }
  };

  const openImageModal = (imageIndex: number) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
    setZoomLevel(1);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    // Restore body scrolling
    document.body.style.overflow = 'unset';
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Close modal if clicking outside the image
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const nextImage = () => {
    if (product) {
      setModalImageIndex(prev => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setModalImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, product]);

  // Generate meta tags data
  const pageTitle = product ? `${product.name} | IronCraft` : 'პროდუქტი | IronCraft';
  const pageDescription = product ? product.description : 'მეტალის კედლის ხელოვნება საქართველოში';
  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
  const pageImage = product && product.images.length > 0 ? getImageUrl(product.images[0]) : `${API_BASE}/default-og-image.jpg`;
  const pageUrl = `${window.location.origin}/product/${id}`;

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        <div className="min-h-screen dark-section flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error || !product) {
      return (
        <>
          <Helmet>
            <title>პროდუქტი ვერ მოიძებნა | IronCraft</title>
            <meta name="description" content="მეტალის კედლის ხელოვნება საქართველოში" />
          </Helmet>
          <div className="min-h-screen dark-section flex items-center justify-center">
            <div className="text-center glassmorphism-card p-12 mx-4">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">პროდუქტი ვერ მოიძებნა</h1>
              <p className="text-blue-200 mb-10 text-lg">უკაცრავად, ვერ ვიპოვნეთ პროდუქტი, რომელსაც ეძებთ.</p>
              <Link to="/products" className="gradient-primary px-8 py-4 rounded-2xl text-white font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                ყველა პროდუქტის ნახვა
              </Link>
            </div>
          </div>
        </>
      );
  }


  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('battery')) return <FaBatteryFull className="text-white" />;
    if (feature.toLowerCase().includes('security') || feature.toLowerCase().includes('lock')) return <FaShieldAlt className="text-white" />;
    if (feature.toLowerCase().includes('install')) return <FaTools className="text-white" />;
    if (feature.toLowerCase().includes('wifi') || feature.toLowerCase().includes('app') || feature.toLowerCase().includes('remote')) return <FaWifi className="text-white" />;
    return <FaCheck className="text-white" />;
  };
  
  // Use variation data if selected, otherwise use base product data
  const displayPrice = selectedVariation?.price || product?.price;
  const displaySalePrice = selectedVariation?.salePrice || (product as any)?.salePrice;
  const displayImages = selectedVariation?.images?.length ? selectedVariation.images : product?.images || [];
  const safeDisplayImages = displayImages && displayImages.length > 0 ? displayImages : (product?.images || []);
  const isOnSale = displaySalePrice ? true : false;
  const salePriceNumber = isOnSale ? parseFloat(String(displaySalePrice)) : undefined;

  return (
    <div className="min-h-screen dark-section">
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="IronCraft" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        {/* Product Specific */}
        {product && (
          <>
            <meta property="product:price:amount" content={isOnSale && salePriceNumber ? salePriceNumber.toString() : product.price} />
            <meta property="product:price:currency" content="GEL" />
            <meta property="product:availability" content="in stock" />
          </>
        )}
      </Helmet>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Breadcrumb */}
      <div className="relative glassmorphism-card border-b border-white/10 rounded-none mt-0.5">
        <div className="w-full max-w-4xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-1">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <Link to="/products" className="glassmorphism-button p-2 text-white hover:text-cyan-300 transition-colors group flex-shrink-0" title="პროდუქტებთან დაბრუნება">
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </Link>
            <div className="flex items-center space-x-2 text-sm text-blue-200 min-w-0">
              <Link to="/" className="hover:text-white transition-colors flex-shrink-0">მთავარი</Link>
              <span className="text-white/50 flex-shrink-0">/</span>
              <Link to="/products" className="hover:text-white transition-colors flex-shrink-0">პროდუქტები</Link>
              <span className="text-white/50 flex-shrink-0">/</span>
              <span className="text-white font-bold truncate min-w-0" title={product.name}>{product.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          {/* Mobile: Color selector on left, Desktop: Normal layout */}
          <div className="md:space-y-6">
            {/* Mobile Layout - Colors overlaid on image */}
            <div className="md:hidden space-y-3">
              <div 
                className="aspect-[4/3] glassmorphism-card cursor-pointer hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                onClick={() => openImageModal(selectedImage)}
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  {/* Color Selector - Overlaid on top-left */}
                  {variations.length > 0 && (
                    <div className="absolute left-3 top-3 flex flex-col gap-2 z-20">
                      {[...new Set(variations.map(v => v.color))].map((color) => {
                        const colorMap: Record<string, { name: string; hex: string }> = {
                          black: { name: 'შავი', hex: '#000000' },
                          white: { name: 'თეთრი', hex: '#FFFFFF' },
                          yellow: { name: 'ყვითელი', hex: '#FFD700' },
                          green: { name: 'მწვანე', hex: '#22C55E' },
                          red: { name: 'წითელი', hex: '#EF4444' },
                          blue: { name: 'ლურჯი', hex: '#3B82F6' },
                          orange: { name: 'ნარინჯისფერი', hex: '#F97316' },
                          pink: { name: 'ვარდისფერი', hex: '#EC4899' },
                          purple: { name: 'იისფერი', hex: '#A855F7' },
                          gray: { name: 'ნაცრისფერი', hex: '#6B7280' },
                          brown: { name: 'ყავისფერი', hex: '#92400E' },
                          gold: { name: 'ოქროსფერი', hex: '#D4AF37' },
                        };
                        const colorInfo = colorMap[color] || { name: color, hex: '#999999' };
                        const isSelected = selectedVariation?.color === color;
                        
                        return (
                          <button
                            key={color}
                            onClick={(e) => {
                              e.stopPropagation();
                              const variation = variations.find(v => v.color === color);
                              if (variation) {
                                setSelectedVariation(variation);
                                setSelectedImage(0);
                              }
                            }}
                            title={colorInfo.name}
                            className="flex-shrink-0 transition-all"
                          >
                            <div
                              className={`w-10 h-10 rounded-full shadow-lg transition-all ${
                                isSelected
                                  ? 'border-3 border-cyan-400'
                                  : 'border-2 border-white hover:border-cyan-300'
                              }`}
                              style={{ backgroundColor: colorInfo.hex }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                    <img
                      src={getImageUrl(safeDisplayImages[selectedImage] || product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
                      }}
                    />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl pointer-events-none">
                    <div className="glassmorphism-button p-3 rounded-2xl">
                      <FaSearchPlus className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="absolute inset-2 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                </div>
              </div>
              
              {safeDisplayImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {safeDisplayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/30 ring-2 ring-cyan-400/50' 
                          : 'glassmorphism-button border-white/20 hover:border-white/40 hover:scale-105 hover:bg-white/10'
                      }`}
                    >
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Layout - Original */}
            <div className="hidden md:block space-y-6">
              <div 
                className="aspect-square glassmorphism-card cursor-pointer hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                onClick={() => openImageModal(selectedImage)}
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <img
                    src={getImageUrl(safeDisplayImages[selectedImage] || product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                    <div className="glassmorphism-button p-3 md:p-4 rounded-2xl">
                      <FaSearchPlus className="text-white text-xl md:text-3xl" />
                    </div>
                  </div>
                  <div className="absolute inset-2 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                </div>
              </div>
              
              {safeDisplayImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {safeDisplayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/30 ring-2 ring-cyan-400/50' 
                          : 'glassmorphism-button border-white/20 hover:border-white/40 hover:scale-105 hover:bg-white/10'
                      }`}
                    >
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Category Badge */}
            

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white">
              {product.name}
            </h1>

            {/* Price */}
            <div className="glassmorphism-card p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {isOnSale && displaySalePrice ? (
                    <div className="flex items-end space-x-3">
                      <span className="text-xl md:text-2xl font-bold line-through text-blue-200/70">{formatPrice(parseFloat(String(displayPrice)))}</span>
                      <span className="text-2xl md:text-3xl lg:text-4xl font-black text-white">{formatPrice(parseFloat(String(displaySalePrice)))}</span>
                    </div>
                  ) : (
                    <span className="text-2xl md:text-3xl lg:text-4xl font-black text-cyan-300">{formatPrice(parseFloat(String(displayPrice)))}</span>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <FaCheck className="text-green-400" />
                    <span className="text-green-300 font-bold text-sm md:text-base">უფასო მიწოდება ჩათვლით</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  {isOnSale && (
                    <div className="gradient-success px-3 py-2 rounded-xl text-white font-bold text-xs md:text-sm">
                      SALE
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Variation Selector */}
            {variations.length > 0 && (
              <ProductVariationSelector
                variations={variations}
                onVariationSelect={(variation) => {
                  setSelectedVariation(variation);
                  setSelectedImage(0);
                }}
              />
            )}
           

            {/* Quantity and Add to Cart */}
            <div className="glassmorphism-card p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center glassmorphism-button rounded-2xl flex-shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 md:px-4 md:py-3 text-white hover:text-cyan-300 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 md:px-6 py-2 md:py-3 text-white font-bold text-base md:text-lg border-x border-white/20">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 md:px-4 md:py-3 text-white hover:text-cyan-300 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 gradient-primary px-4 md:px-8 py-3 md:py-4 rounded-2xl text-white font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 md:space-x-3 text-sm md:text-base lg:text-lg"
                >
                  <FaShoppingCart className="text-base md:text-xl" />
                  <span>კალათაში დამატება</span>
                </button>
              </div>

               {/* Description */}
            <div className="glassmorphism-card p-4 md:p-6">
              <p className="text-blue-100 text-sm md:text-base leading-relaxed font-medium">{product.description}</p>
            </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="glassmorphism-button p-3 md:p-4 text-center group hover:scale-105 transition-transform duration-300">
                <FaShieldAlt className="text-green-400 text-lg md:text-2xl mx-auto mb-2 group-hover:animate-pulse" />
                <p className="text-white text-xs md:text-sm font-bold">რკინის ხარისხი</p>
              </div>
              <div className="glassmorphism-button p-3 md:p-4 text-center group hover:scale-105 transition-transform duration-300">
                <FaFire className="text-orange-400 text-lg md:text-2xl mx-auto mb-2 group-hover:animate-pulse" />
                <p className="text-white text-xs md:text-sm font-bold">თერმული საღებავი</p>
              </div>
              <div className="glassmorphism-button p-3 md:p-4 text-center group hover:scale-105 transition-transform duration-300">
                <FaPaintBrush className="text-purple-400 text-lg md:text-2xl mx-auto mb-2 group-hover:animate-pulse" />
                <p className="text-white text-xs md:text-sm font-bold">მსუბუქი წონა</p>
              </div>
              <div className="glassmorphism-button p-3 md:p-4 text-center group hover:scale-105 transition-transform duration-300">
                <FaCheck className="text-blue-400 text-lg md:text-2xl mx-auto mb-2 group-hover:animate-pulse" />
                <p className="text-white text-xs md:text-sm font-bold">ხელით დამუშავებული</p>
              </div>
            </div>

            {/* Custom Order CTA */}
            <div className="glassmorphism-card p-6 md:p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    🎨 მოგწონთ ეს პროდუქტი?
                  </h3>
                  <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                    გსურთ <span className="font-bold text-cyan-300">სხვა ზომა</span>, 
                    <span className="font-bold text-purple-300"> განსხვავებული დიზაინი</span> ან 
                    <span className="font-bold text-pink-300"> თქვენი საკუთარი იდეა</span>?
                    <br />
                    ჩვენ შევქმნით სპეციალურად თქვენთვის!
                  </p>
                </div>
                <Link
                  to="/custom-order"
                  className="gradient-accent px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 whitespace-nowrap"
                >
                  <FaPaintBrush className="text-lg md:text-xl" />
                  <span className="text-sm md:text-base">ინდივიდუალური შეკვეთა</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rich Product Description - Similar to Alibaba */}
        <div className="mt-16 w-full max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="glassmorphism-card overflow-hidden">
            {/* About This Item Section */}
            <div className="p-2 md:p-6 border-b border-white/20 md:border-b md:border-white/20">
              <div className="md:glassmorphism-card p-2 md:p-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-left mb-6 md:mb-8 border-b border-white/20 pb-4 md:pb-6 text-white">
                  ამ პროდუქტის შესახებ
                </h1>
                {/* Dynamic Detailed Description from Database */}
                {(product as any)?.detailedDescription && (product as any).detailedDescription.length > 0 ? (
                  <div className="space-y-6 text-blue-100 leading-relaxed">
                    {(product as any).detailedDescription.map((section: string, index: number) => {
                      // Extract emoji and content
                      const emojiMatch = section.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);
                      const emoji = emojiMatch ? emojiMatch[0] : `${index + 1}️⃣`;
                      const content = emojiMatch ? section.slice(emojiMatch[0].length).trim() : section;
                      
                      // Color variations for different sections
                      const colors = [
                        'text-cyan-300',
                        'text-green-300', 
                        'text-blue-300',
                        'text-purple-300',
                        'text-emerald-300',
                        'text-yellow-300',
                        'text-red-300'
                      ];
                      const colorClass = colors[index % colors.length];
                      
                      // Special styling for warning sections
                      const isWarning = emoji === '⚠️' || content.toLowerCase().includes('ყურადღება');
                      
                      return (
                        <div 
                          key={index}
                          className={`md:glassmorphism-button ${isWarning ? 'md:border md:border-red-400/50' : ''} p-1 md:p-6 flex items-start space-x-2 md:space-x-4 w-full`}
                        >
                          <span className="text-2xl md:text-3xl flex-shrink-0">{emoji}</span>
                          <div className="text-white flex-1">
                            {/* Extract title and description if content has colon */}
                            {content.includes(':') ? (
                              <p>
                                <span className={`font-bold ${colorClass}`}>
                                  {content.split(':')[0]}:
                                </span>
                                {content.split(':').slice(1).join(':')}
                              </p>
                            ) : (
                              <p>{content}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Fallback message if no detailed description is available
                  <div className="text-center py-8">
                    <p className="text-blue-200">დეტალური აღწერა მალე იქნება ხელმისაწვდომი</p>
                  </div>
                )}
              </div>
            </div>


            {/* Features */}
            <div className="p-2 md:p-6 border-b border-white/20 md:border-b md:border-white/20">
              <div className="md:glassmorphism-card p-2 md:p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-left mb-6 md:mb-8 border-b border-white/20 pb-4 md:pb-6 text-white">
                  მთავარი მახასიათებლები
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.features.map((feature, index) => (
                    <div key={index} className="md:glassmorphism-button p-1 md:p-6 flex items-start space-x-1 md:space-x-4 md:hover:scale-105 transition-transform duration-300 w-full">
                      <div className="flex-shrink-0 gradient-primary p-1.5 md:p-3 rounded-lg md:rounded-xl min-w-[24px] md:min-w-[36px]">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="text-white leading-relaxed font-medium flex-1 pl-1 md:pl-0">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 glassmorphism-card p-6 md:p-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
                მსგავსი პროდუქტები
              </h3>
              <p className="text-blue-200 text-lg">აღმოაჩინეთ სხვა პროდუქტები ამ კატეგორიიდან</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.slug}`} className="glassmorphism-card group overflow-hidden hover:scale-105 transform transition-all duration-300 hover:shadow-2xl block">
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src={getImageUrl(relatedProduct.images[0])}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                        onError={(e) => {
                          e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="glass-badge px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                          {relatedProduct.category}
                        </span>
                      </div>
                      {relatedProduct.isOnSale && relatedProduct.salePrice && (
                        <div className="absolute top-3 right-3">
                          <span className="glass-badge px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            ფასდაკლება
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{relatedProduct.name}</h4>
                      <p className="text-blue-200 text-sm mb-3 line-clamp-2">{relatedProduct.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        {relatedProduct.isOnSale && relatedProduct.salePrice ? (
                          <div className="flex flex-col">
                            <span className="text-2xl font-black gradient-text-accent">₾{parseFloat(String(relatedProduct.salePrice)).toFixed(2)}</span>
                            <span className="text-sm text-blue-300/70 line-through">₾{parseFloat(relatedProduct.price).toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-black gradient-text-accent">₾{parseFloat(relatedProduct.price).toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dispatch(addToCart({ product: relatedProduct, quantity: 1 }));
                            toast.success(`${relatedProduct.name} კალათაში დაემატა!`);
                            dispatch(openCart());
                          }}
                          className="flex-1 gradient-primary py-2 rounded-xl text-white font-bold hover:shadow-lg transition-all duration-300 text-sm"
                        >
                          🛒 კალათაში
                        </button>
                      </div>
                    </div>
                </Link>
              ))}
            </div>

          {/* View All Products CTA */}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 gradient-primary text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              ყველა პროდუქტის ნახვა
              <FaArrowLeft className="ml-2 rotate-180" />
            </Link>
          </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && product && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={handleModalClick}
        >
          {/* Close button */}
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <FaTimes className="text-3xl" />
          </button>

          {/* Navigation arrows */}
          {safeDisplayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <FaArrowLeft className="text-3xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 flex space-x-2 z-10">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSearchMinus />
            </button>
            <span className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSearchPlus />
            </button>
          </div>

          {/* Image counter */}
          {safeDisplayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg z-10">
              {modalImageIndex + 1} / {safeDisplayImages.length}
            </div>
          )}

          {/* Main image */}
          <div className="max-w-8xl max-h-screen w-full h-full flex items-center justify-center p-4">
            <img
              src={getImageUrl(safeDisplayImages[modalImageIndex] || product.images[0])}
              alt={`${product.name} - Image ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{ 
                transform: `scale(${zoomLevel})`,
                cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in'
              }}
              onClick={handleModalClick}
              onError={(e) => {
                e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
              }}
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-2 rounded-lg z-10">
            <div className="flex flex-col space-y-1">
              <span>ESC - დახურვა</span>
              <span>← → - ნავიგაცია</span>
              <span>+/- - ზუმი</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;