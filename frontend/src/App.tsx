import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CustomOrderPage from './pages/CustomOrderPage';
import GalleryPage from './pages/GalleryPage';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import CartSidebar from './components/Cart/CartSidebar';
import ScrollToTop from './components/UI/ScrollToTop';
import MobileBottomNav from './components/Layout/MobileBottomNav';

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <AuthProvider>
          <Router>
          <ScrollToTop />
          <div className="min-h-screen dark-section pb-16 md:pb-0">
            <Navbar />
            <main className="min-h-screen pt-20">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/custom-order" element={<CustomOrderPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                  </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
            <CartSidebar />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
    </HelmetProvider>
  );
}

export default App;