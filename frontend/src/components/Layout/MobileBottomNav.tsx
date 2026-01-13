import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { addToCart, openCart } from '../../store/cartSlice';
import { useGetProductByIdQuery } from '../../services/productsApi';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isProductPage = /^\/product\//.test(location.pathname);
  const matched = location.pathname.match(/^\/product\/(\d+)/);
  const productId = isProductPage && matched ? Number(matched[1]) : undefined;
  const { data: product } = useGetProductByIdQuery(productId as number, { skip: !productId });

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
    navigate('/payment');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-slate-900/70">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-2 p-3">
          <Link to="/" className="flex flex-col items-center text-xs text-blue-100 hover:text-white">
            <span className="text-lg">🏠</span>
            <span>მთავარი</span>
          </Link>
          <Link to="/products" className="flex flex-col items-center text-xs text-blue-100 hover:text-white">
            <span className="text-lg">🛍️</span>
            <span>პროდუქტები</span>
          </Link>
          {!isProductPage ? (
            <button
              onClick={() => dispatch(openCart())}
              className="flex flex-col items-center text-xs text-blue-100 hover:text-white"
            >
              <span className="text-lg">🛒</span>
              <span>კალათა</span>
            </button>
          ) : (
            <button
              onClick={handleBuyNow}
              className="flex flex-col items-center text-xs text-white"
            >
              <span className="text-lg">⚡</span>
              <span>ყიდვა ახლა</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
