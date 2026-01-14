import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { translateColor } from '../../utils/colorTranslations';
import { 
  setCartOpen, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  selectCartTotal,
  selectCartItemsCount
} from '../../store/cartSlice';

const CartSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, items: cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = useAppSelector(selectCartTotal);
  const itemsCount = useAppSelector(selectCartItemsCount);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${API_BASE}${imagePath}`;
  };

  const formatPrice = (price: string) => {
    return `₾${parseFloat(price).toFixed(2)}`;
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => dispatch(setCartOpen(false))}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <FaShoppingBag className="text-blue-600" />
            <h2 className="text-xl font-semibold">სავაჭრო კალათა ({itemsCount})</h2>
          </div>
          <button
            onClick={() => dispatch(setCartOpen(false))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FaShoppingBag className="text-6xl mb-4 opacity-50" />
              <p className="text-lg">თქვენი კალათა ცარიელია</p>
              <p className="text-sm">დაამატეთ ჭკვიანი ჩამკეტები დასაწყებად!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                // Prioritize variation image, then thumbnail, then product images
                const imageUrl = item.variation?.images?.[0] || item.product.thumbnail || item.product.images?.[0];
                
                return (
                <div key={`${item.product.id}-${item.variation?.color || ''}-${item.variation?.size || ''}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {/* Product Image */}
                  <img
                    src={getImageUrl(imageUrl)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80';
                    }}
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                    {item.variation && (
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">ფერი:</span> {translateColor(item.variation.color)} | <span className="font-medium">ზომა:</span> {item.variation.size}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {item.variation ? (
                        // Use variation price
                        item.variation.salePrice ? (
                          <>
                            <span className="text-green-600 font-semibold mr-2">{formatPrice(item.variation.salePrice)}</span>
                            <span className="line-through opacity-60">{formatPrice(item.variation.price)}</span>
                          </>
                        ) : (
                          formatPrice(item.variation.price)
                        )
                      ) : (
                        // Use product price
                        item.product.isOnSale && item.product.salePrice ? (
                          <>
                            <span className="text-green-600 font-semibold mr-2">{formatPrice(String(item.product.salePrice))}</span>
                            <span className="line-through opacity-60">{formatPrice(item.product.price)}</span>
                          </>
                        ) : (
                          formatPrice(item.product.price)
                        )
                      )}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
                );
              })}

              {/* Clear Cart Button */}
              {cartItems.length > 0 && (
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  კალათის გასუფთავება
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>სულ:</span>
              <span className="text-green-600">
                ₾{cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => {
                dispatch(setCartOpen(false));
                navigate('/payment');
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              შეუკვეთე ახლავე
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              დაამატე სხვა პროდუქტი
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
