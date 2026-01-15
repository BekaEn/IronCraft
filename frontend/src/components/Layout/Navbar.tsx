import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaChevronDown, FaCog, FaSignOutAlt, FaUserEdit, FaShoppingCart, FaShieldAlt } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleCart, selectCartItemsCount } from '../../store/cartSlice';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const navigate = useNavigate();
  const { user: userData, logout: authLogout, isLoading } = useAuth();
  
  // State for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authLogout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 group">
            <div className="gradient-primary p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl group-hover:animate-pulse">
              <FaShieldAlt className="text-white text-base sm:text-lg md:text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white">IronCraft</span>
              <span className="text-xs text-blue-200">მეტალის კედლის დეკორაცია</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="px-6 py-3 text-white hover:text-cyan-300 transition-colors font-bold">
              მთავარი
            </Link>
            <Link to="/products" className="px-6 py-3 text-white hover:text-purple-300 transition-colors font-bold">
              პროდუქტები
            </Link>
            <Link to="/gallery" className="px-6 py-3 text-white hover:text-green-300 transition-colors font-bold">
              ნამუშევრები
            </Link>
            <Link to="/contact" className="px-6 py-3 text-white hover:text-orange-300 transition-colors font-bold">
              კონტაქტი
            </Link>
          </div>

          {/* Cart and User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Cart Button */}
            <button 
              onClick={() => dispatch(toggleCart())}
              className="relative glassmorphism-button p-2 sm:p-3 md:p-4 text-white hover:text-green-300 transition-colors group"
            >
              <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 md:-top-2 md:-right-2 gradient-warning text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            {isLoading ? (
              <div className="glassmorphism-button w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full animate-pulse"></div>
            ) : userData ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Account Dropdown */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 glassmorphism-button text-white hover:text-cyan-300 transition-colors px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl group"
                >
                  <div className="gradient-accent p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl group-hover:animate-pulse">
                    <FaUser className="text-white text-xs sm:text-sm md:text-lg" />
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-sm font-bold">{userData.firstName || 'მომხმარებელი'}</span>
                    <span className="text-xs text-blue-200">{userData.email}</span>
                  </div>
                  <FaChevronDown className={`text-xs sm:text-sm transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 sm:w-72 glassmorphism-card border border-white/20 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-6 py-4 border-b border-white/20">
                      <div className="flex items-center space-x-4">
                        <div className="gradient-primary p-3 rounded-xl">
                          <FaUser className="text-white text-lg" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">
                            {userData.firstName} {userData.lastName}
                          </p>
                          <p className="text-sm text-blue-200">{userData.email}</p>
                          {userData.isAdmin && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gradient-success text-white mt-2">
                              <FaUserShield className="mr-2" />
                              ადმინისტრატორი
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          // Navigate to profile page when implemented
                          console.log('Navigate to profile');
                        }}
                        className="flex items-center w-full px-6 py-3 text-white hover:bg-white/10 transition-colors group"
                      >
                        <FaUserEdit className="mr-4 text-cyan-400 group-hover:text-white" />
                        <span className="font-medium">პროფილის რედაქტირება</span>
                      </button>

                      {userData.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center w-full px-6 py-3 text-white hover:bg-white/10 transition-colors group"
                        >
                          <FaUserShield className="mr-4 text-purple-400 group-hover:text-white" />
                          <span className="font-medium">ადმინისტრაციული პანელი</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          // Navigate to settings when implemented
                          console.log('Navigate to settings');
                        }}
                        className="flex items-center w-full px-6 py-3 text-white hover:bg-white/10 transition-colors group"
                      >
                        <FaCog className="mr-4 text-blue-400 group-hover:text-white" />
                        <span className="font-medium">პარამეტრები</span>
                      </button>

                      <div className="border-t border-white/20 mx-4 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3 text-red-300 hover:bg-red-500/20 transition-colors group"
                      >
                        <FaSignOutAlt className="mr-4 text-red-400 group-hover:text-red-300" />
                        <span className="font-medium">გასვლა</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="gradient-primary px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 font-bold text-xs sm:text-sm md:text-base"
              >
                <FaUser className="text-xs sm:text-sm md:text-base" />
                <span>შესვლა</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;