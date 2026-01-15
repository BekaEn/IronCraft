import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { addToCart, openCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    if (product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success(`${product.name} კალათაში დაემატა!`);
      dispatch(openCart());
    } else {
      toast.error('პროდუქტი მარაგში არაა');
    }
  };

  const formatPrice = (price: string) => {
    return `₾${parseFloat(price).toFixed(2)}`;
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return 'https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${API_BASE}${imagePath}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors">
      {/* Image */}
      <div className="relative">
        {/* Example badge left-top; keep dynamic later */}
        {/* <div className="absolute left-2 top-2 z-10 rounded-full bg-indigo-500/90 px-2 py-1 text-[10px] font-medium text-white ring-1 ring-indigo-400/60">Bestseller</div> */}
        <Link to={`/product/${product.slug}`} className="block">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={getImageUrl(product.thumbnail || product.images?.[0])}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif';
              }}
            />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${product.slug}`}>
              <h3 className="text-sm font-medium text-white">{product.name}</h3>
            </Link>
            {/* Feature chips (replace ratings) */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.features?.slice(0, 2).map((feature, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-neutral-200">
                  {feature.length > 24 ? feature.slice(0, 24) + '…' : feature}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white">{product.isOnSale && product.salePrice ? formatPrice(String(product.salePrice)) : formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 rounded-md bg-white text-neutral-900 px-3 py-2 text-xs font-medium hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-500"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 10a4 4 0 0 1-8 0"/>
              <path d="M3.103 6.034h17.794"/>
              <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
            </svg>
            კალათაში
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300 hover:bg-white/10 hover:ring-1 hover:ring-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            სწრაფი ნახვა
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;