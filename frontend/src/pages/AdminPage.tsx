import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTachometerAlt, FaShoppingCart, FaBell, FaEnvelope, FaPhone, FaPaintBrush } from 'react-icons/fa';
import { useGetSlidesQuery, useCreateSlideMutation, useUpdateSlideMutation, useDeleteSlideMutation, type HeroSlide as SlideType } from '../services/heroSlidesApi';
import { useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation, useCreateProductMutation, type Product } from '../services/productsApi';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../services/settingsApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ProductForm from '../components/Admin/ProductForm';
import CustomOrdersSection from '../components/Admin/CustomOrdersSection';
import GallerySection from '../components/Admin/GallerySection';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  orderId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentNumber: string;
    address: string;
    comment?: string;
  };
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
    variation?: {
      color: string;
      size: string;
      price: string;
      salePrice?: string | null;
    };
  }>;
  totalAmount: number;
  paymentMethod: 'online' | 'cash' | 'bank_transfer' | string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Contact {
  id: number;
  contactId: string;
  name: string;
  email: string;
  phone?: string;
  subject: 'sales' | 'support' | 'installation' | 'warranty' | 'other';
  message: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const { data: settings } = useGetSettingsQuery();
  const [updateSettings, { isLoading: savingSettings }] = useUpdateSettingsMutation();
  const [promoEnabled, setPromoEnabled] = useState<boolean>(false);
  const [promoText, setPromoText] = useState<string>('');
  const [promoYoutubeUrl, setPromoYoutubeUrl] = useState<string>('');

  useEffect(() => {
    if (settings) {
      setPromoEnabled(Boolean(settings.promoEnabled));
      setPromoText(settings.promoText || '');
      setPromoYoutubeUrl(settings.promoYoutubeUrl || '');
    }
  }, [settings]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'contacts' | 'hero' | 'custom-orders' | 'gallery'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [updatingContactId, setUpdatingContactId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const { data, isLoading, refetch } = useGetProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: slidesData, refetch: refetchSlides } = useGetSlidesQuery();
  const [createSlide] = useCreateSlideMutation();
  const [updateSlide] = useUpdateSlideMutation();
  const [deleteSlideMutation] = useDeleteSlideMutation();

  type SlideForm = Partial<SlideType>;
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [slideForm, setSlideForm] = useState<SlideForm>({
    title: '',
    subtitle: '',
    description: '',
    youtubeUrl: '',
    imageUrl: '',
    primaryButtonText: '',
    primaryButtonUrl: '',
    secondaryButtonText: '',
    secondaryButtonUrl: '',
    order: 0,
    isActive: true,
  });

  const openNewSlideModal = () => {
    setEditingSlideId(null);
    setSlideForm({
      title: '',
      subtitle: '',
      description: '',
      youtubeUrl: '',
      imageUrl: '',
      primaryButtonText: '',
      primaryButtonUrl: '',
      secondaryButtonText: '',
      secondaryButtonUrl: '',
      order: (slidesData?.slides?.length || 0),
      isActive: true,
    });
    setIsSlideModalOpen(true);
  };

  const openEditSlideModal = (s: SlideType) => {
    setEditingSlideId(s.id);
    setSlideForm({ ...s });
    setIsSlideModalOpen(true);
  };

  const closeSlideModal = () => {
    setIsSlideModalOpen(false);
  };

  const saveSlide = async () => {
    try {
      if (!slideForm.title || slideForm.title.trim() === '') {
        toast.error('სათაური სავალდებულოა');
        return;
      }
      if (editingSlideId) {
        await updateSlide({ id: editingSlideId, data: slideForm });
        toast.success('სლაიდი განახლდა');
      } else {
        await createSlide(slideForm);
        toast.success('სლაიდი შეიქმნა');
      }
      setIsSlideModalOpen(false);
      refetchSlides();
    } catch (e) {
      toast.error('შენახვა ვერ მოხერხდა');
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setOrders(result.orders || []);
      } else {
        toast.error('შეკვეთების ჩამოტვირთვა ვერ მოხერხდა');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('შეკვეთების ჩამოტვირთვისას მოხდა შეცდომა');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string, newPaymentStatus?: string) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newPaymentStatus && { paymentStatus: newPaymentStatus })
        })
      });
      
      if (response.ok) {
        await response.json();
        toast.success('შეკვეთის სტატუსი განახლდა');
        // Refresh orders list
        fetchOrders();
      } else {
        toast.error('შეკვეთის განახლება ვერ მოხერხდა');
      }
    } catch (error) {
      console.error('Update order error:', error);
      toast.error('შეკვეთის განახლებისას მოხდა შეცდომა');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete order
  const deleteOrder = async (orderId: number) => {
    if (!confirm('ნამდვილად გსურთ ამ შეკვეთის წაშლა?')) return;
    
    setDeletingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        toast.success('შეკვეთა წარმატებით წაიშალა');
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setOrderDetailsOpen(false);
          setSelectedOrder(null);
        }
      } else {
        toast.error('შეკვეთის წაშლა ვერ მოხერხდა');
      }
    } catch (error) {
      console.error('Delete order error:', error);
      toast.error('შეკვეთის წაშლისას მოხდა შეცდომა');
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Open order details
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  // Fetch contacts
  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setContacts(result.contacts || []);
      } else {
        toast.error('კონტაქტების ჩამოტვირთვა ვერ მოხერხდა');
      }
    } catch (error) {
      console.error('Fetch contacts error:', error);
      toast.error('კონტაქტების ჩამოტვირთვისას მოხდა შეცდომა');
    } finally {
      setContactsLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId: number, newStatus: string) => {
    setUpdatingContactId(contactId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        await response.json();
        toast.success('კონტაქტის სტატუსი განახლდა');
        // Refresh contacts list
        fetchContacts();
      } else {
        toast.error('კონტაქტის განახლება ვერ მოხერხდა');
      }
    } catch (error) {
      console.error('Update contact error:', error);
      toast.error('კონტაქტის განახლებისას მოხდა შეცდომა');
    } finally {
      setUpdatingContactId(null);
    }
  };

  // Delete contact
  const deleteContact = async (contactId: number) => {
    if (!window.confirm('ნამდვილად გსურთ ამ კონტაქტის წაშლა?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        toast.success('კონტაქტი წაიშალა');
        fetchContacts();
      } else {
        toast.error('კონტაქტის წაშლა ვერ მოხერხდა');
      }
    } catch (error) {
      console.error('Delete contact error:', error);
      toast.error('კონტაქტის წაშლისას მოხდა შეცდომა');
    }
  };

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  // Check if user is admin
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (!userData.isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      }
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);


  const handleDeleteProduct = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      // Convert the data to match API expectations
      const apiData = {
        ...productData,
        // For now, we'll pass images as they are since the backend might accept string arrays
      } as any;
      
      const result = await createProduct(apiData).unwrap();
      console.log('✅ Product created with ID:', result.id);
      toast.success('Product created successfully');
      setShowAddProduct(false);
      refetch();
      return result; // Return the created product so variations can be saved
    } catch (error) {
      toast.error('Failed to create product');
      throw error;
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;
    
    try {
      const result = await updateProduct({ 
        id: editingProduct.id, 
        data: productData 
      }).unwrap();
      toast.success('Product updated successfully');
      setEditingProduct(null);
      refetch();
      return result; // Return the updated product
    } catch (error) {
      toast.error('Failed to update product');
      throw error;
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const formatPrice = (price: string) => {
    return `₾${parseFloat(price).toFixed(2)}`;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen dark-section flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Admin Header */}
      <div className="glassmorphism-card mx-4 mt-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <FaTachometerAlt className="text-cyan-400 text-3xl" />
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                ადმინისტრატორის პანელი
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="border-t border-white/20">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'products'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/30'
                }`}
              >
                <FaEye className="inline mr-2" />
                პროდუქტები
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/30'
                }`}
              >
                <FaShoppingCart className="inline mr-2" />
                შეკვეთები
                {orders.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'contacts'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/30'
                }`}
              >
                <FaEnvelope className="inline mr-2" />
                კონტაქტები
                {contacts.filter(c => c.status === 'new').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {contacts.filter(c => c.status === 'new').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('hero')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'hero'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/30'
                }`}
              >
                <FaEdit className="inline mr-2" />
                ჰირო სლაიდერები
              </button>
              <button
                onClick={() => setActiveTab('custom-orders')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'custom-orders'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/30'
                }`}
              >
                <FaPaintBrush className="inline mr-2" />
                ინდივიდუალური შეკვეთები
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'gallery'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-white/30'
                }`}
              >
                🖼️ ნამუშევრები
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? (
          <>
            {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Site Settings */}
          <div className="glassmorphism-card p-6 md:col-span-3">
            <h2 className="text-2xl font-black text-white mb-4">საიტის პარამეტრები</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-cyan-400"
                  checked={promoEnabled}
                  onChange={(e) => setPromoEnabled(e.target.checked)}
                />
                <span className="text-white font-medium">Promo ბანერის ჩართვა</span>
              </label>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white mb-2">Promo ტექსტი</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 glassmorphism-button text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={promoText}
                  onChange={(e) => setPromoText(e.target.value)}
                  placeholder="🔥 შემოსაზღვრული დროითი შეთავაზება: 30% ფასდაკლება!"
                />
              </div>
              {/* <div className="md:col-span-3">
                <label className="block text-sm font-bold text-white mb-2">YouTube ვიდეო ბმული</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 glassmorphism-button text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={promoYoutubeUrl}
                  onChange={(e) => setPromoYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {settings?.promoYoutubeThumbnail && (
                  <div className="mt-3 flex items-center space-x-3">
                    <img src={settings.promoYoutubeThumbnail} alt="yt thumb" className="w-24 h-16 object-cover rounded" />
                    <div className="text-blue-200 text-sm truncate">{settings.promoYoutubeTitle}</div>
                  </div>
                )}
              </div> */}
            </div>
            <div className="mt-4">
              <button
                onClick={() => updateSettings({ promoEnabled, promoText, promoYoutubeUrl })}
                disabled={savingSettings}
                className="gradient-primary px-6 py-3 rounded-xl text-white font-bold disabled:opacity-60"
              >
                პარამეტრების შენახვა
              </button>
            </div>
          </div>
          <div className="glassmorphism-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-cyan-500/20">
                <FaTachometerAlt className="text-cyan-400 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">სულ პროდუქტები</p>
                <p className="text-3xl font-black text-white">{data?.totalProducts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="glassmorphism-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <FaEye className="text-green-400 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">აქტიური პროდუქტები</p>
                <p className="text-3xl font-black text-white">
                  {data?.products.filter(p => p.isActive).length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="glassmorphism-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <FaEdit className="text-yellow-400 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">დაბალი მარაგი</p>
                <p className="text-3xl font-black text-white">
                  {data?.products.filter(p => p.stock < 10).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Management */}
        <div className="glassmorphism-card">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                პროდუქტების მართვა
              </h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center space-x-2 gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <FaPlus />
                <span>ახალი პროდუქტი</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    პროდუქტი
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    კატეგორია
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    ფასი
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    მარაგი
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    სტატუსი
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    ქმედებები
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {data?.products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images[0] || 'https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13617.jpg?semt=ais_hybrid&w=740&q=80'}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-white">{product.name}</div>
                          <div className="text-sm text-blue-200">{product.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        product.category === 'fingerprint' ? 'bg-blue-500/20 text-blue-300' :
                        product.category === 'faceid' ? 'bg-green-500/20 text-green-300' :
                        product.category === 'combo' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {product.category === 'fingerprint' ? 'თითის ანაბეჭდი' :
                         product.category === 'faceid' ? 'Face ID' :
                         product.category === 'combo' ? 'კომბო' : product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        product.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {product.isActive ? 'აქტიური' : 'არააქტიური'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-500/20 rounded-lg transition-all"
                          title="ნახვა"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-green-400 hover:text-green-300 p-2 hover:bg-green-500/20 rounded-lg transition-all"
                          title="რედაქტირება"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          title="წაშლა"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-blue-200 text-lg">პროდუქტები ვერ მოიძებნა. დაამატეთ პირველი პროდუქტი!</p>
            </div>
          )}
        </div>
          </>
        ) : activeTab === 'orders' ? (
          // Orders Tab Content
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                შეკვეთები & კლიენტების შეტყობინებები
              </h2>
              <button
                onClick={fetchOrders}
                className="gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaBell />
                <span>განახლება</span>
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : orders.length === 0 ? (
              <div className="glassmorphism-card p-8 text-center">
                <FaShoppingCart className="text-cyan-400 text-6xl mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-4">შეკვეთები ჯერ არ არის</h3>
                <p className="text-blue-200 text-lg">კლიენტების შეკვეთები აქ გამოჩნდება, როცა ისინი შეკვეთას განახორციელებენ.</p>
              </div>
            ) : (
              <div className="glassmorphism-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/20">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          შეკვეთის ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          კლიენტი
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          კონტაქტი
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          გადახდა
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          სულ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          თარიღი
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          ქმედებები
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-white">{order.orderId}</div>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                              order.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                              order.status === 'shipped' ? 'bg-purple-500/20 text-purple-300' :
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-300' :
                              order.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {order.status === 'pending' ? 'მოლოდინში' :
                               order.status === 'processing' ? 'დამუშავება' :
                               order.status === 'shipped' ? 'გაგზავნილი' :
                               order.status === 'delivered' ? 'მიტანილი' :
                               order.status === 'cancelled' ? 'გაუქმებული' :
                               order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-white">
                              {order.customerInfo.firstName} {order.customerInfo.lastName}
                            </div>
                            <div className="text-sm text-blue-200">{order.customerInfo.documentNumber}</div>
                            <div className="text-sm text-blue-200">{order.customerInfo.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              <FaEnvelope className="inline mr-1 text-cyan-400" />
                              {order.customerInfo.email}
                            </div>
                            <div className="text-sm text-white mt-1">
                              <FaPhone className="inline mr-1 text-cyan-400" />
                              {order.customerInfo.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              order.paymentMethod === 'online' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : order.paymentMethod === 'bank_transfer'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              {order.paymentMethod === 'online' ? 'Online (TBC)' : 
                               order.paymentMethod === 'bank_transfer' ? 'საბანკო გადარიცხვა' : 
                               'ნაღდი ფული მიტანისას'}
                            </span>
                            <div className="text-sm text-blue-200 mt-1">{order.paymentStatus}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            ₾{order.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                            {new Date(order.createdAt).toLocaleDateString('ka-GE')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  disabled={updatingOrderId === order.id}
                                  className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-xs hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/30"
                                >
                                  {updatingOrderId === order.id ? '...' : 'დადასტურება'}
                                </button>
                              )}
                              
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  disabled={updatingOrderId === order.id}
                                  className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded text-xs hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
                                >
                                  {updatingOrderId === order.id ? '...' : 'გაგზავნა'}
                                </button>
                              )}
                              
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  disabled={updatingOrderId === order.id}
                                  className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded text-xs hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30"
                                >
                                  {updatingOrderId === order.id ? '...' : 'მიტანა დასრულდა'}
                                </button>
                              )}
                              
                              {order.status === 'delivered' && (
                                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-xs font-semibold border border-green-500/30">
                                  ✅ დასრულებულია
                                </span>
                              )}
                              
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  disabled={updatingOrderId === order.id}
                                  className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
                                >
                                  {updatingOrderId === order.id ? '...' : 'გაუქმება'}
                                </button>
                              )}
                              
                              <button
                                onClick={() => openOrderDetails(order)}
                                className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded text-xs hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                              >
                                <FaEye className="inline mr-1" />
                                დეტალები
                              </button>
                              
                              <button
                                onClick={() => deleteOrder(order.id)}
                                disabled={deletingOrderId === order.id}
                                className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
                              >
                                {deletingOrderId === order.id ? '...' : <><FaTrash className="inline mr-1" />წაშლა</>}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'contacts' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                კონტაქტის შეტყობინებები & კლიენტების მოთხოვნები
              </h2>
              <button
                onClick={fetchContacts}
                className="gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaEnvelope />
                <span>განახლება</span>
              </button>
            </div>

            {contactsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : contacts.length === 0 ? (
              <div className="glassmorphism-card p-8 text-center">
                <FaEnvelope className="text-cyan-400 text-6xl mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-4">კონტაქტის შეტყობინებები ჯერ არ არის</h3>
                <p className="text-blue-200 text-lg">კლიენტების მოთხოვნები აქ გამოჩნდება, როცა ისინი კონტაქტის ფორმას შეავსებენ.</p>
              </div>
            ) : (
              <div className="glassmorphism-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/20">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          კონტაქტის ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          კლიენტი
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          თემა
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          შეტყობინება
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          სტატუსი
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          თარიღი
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                          ქმედებები
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className={`hover:bg-white/5 transition-colors ${contact.status === 'new' ? 'bg-blue-500/10' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-300">
                            {contact.contactId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-white">{contact.name}</div>
                            <div className="text-sm text-blue-200">{contact.email}</div>
                            {contact.phone && <div className="text-sm text-blue-200">{contact.phone}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              contact.subject === 'sales' ? 'bg-green-500/20 text-green-300' :
                              contact.subject === 'support' ? 'bg-blue-500/20 text-blue-300' :
                              contact.subject === 'installation' ? 'bg-purple-500/20 text-purple-300' :
                              contact.subject === 'warranty' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {contact.subject === 'sales' ? '🛒 ყიდვა' :
                               contact.subject === 'support' ? '🔧 მხარდაჭერა' :
                               contact.subject === 'installation' ? '⚙️ ინსტალაცია' :
                               contact.subject === 'warranty' ? '🛡️ გარანტია' :
                               '📋 სხვა'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white max-w-xs truncate" title={contact.message}>
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              contact.status === 'new' ? 'bg-red-500/20 text-red-300' :
                              contact.status === 'read' ? 'bg-yellow-500/20 text-yellow-300' :
                              contact.status === 'responded' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {contact.status === 'new' ? 'ახალი' :
                               contact.status === 'read' ? 'წაკითხული' :
                               contact.status === 'responded' ? 'პასუხგაცემული' :
                               'დახურული'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                            {new Date(contact.createdAt).toLocaleDateString('ka-GE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {contact.status === 'new' && (
                                <button
                                  onClick={() => updateContactStatus(contact.id, 'read')}
                                  disabled={updatingContactId === contact.id}
                                  className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded text-xs hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
                                >
                                  {updatingContactId === contact.id ? '...' : 'წაკითხვა'}
                                </button>
                              )}
                              
                              {(contact.status === 'read' || contact.status === 'new') && (
                                <button
                                  onClick={() => updateContactStatus(contact.id, 'responded')}
                                  disabled={updatingContactId === contact.id}
                                  className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-xs hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/30"
                                >
                                  {updatingContactId === contact.id ? '...' : 'პასუხი გაცემული'}
                                </button>
                              )}
                              
                              {contact.status === 'responded' && (
                                <button
                                  onClick={() => updateContactStatus(contact.id, 'closed')}
                                  disabled={updatingContactId === contact.id}
                                  className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded text-xs hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30"
                                >
                                  {updatingContactId === contact.id ? '...' : 'დახურვა'}
                                </button>
                              )}
                              
                              <button
                                onClick={() => deleteContact(contact.id)}
                                className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-colors border border-red-500/30"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'hero' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">ჰირო სლაიდერები</h2>
              <button
                onClick={openNewSlideModal}
                className="gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaPlus />
                <span>დამატება</span>
              </button>
            </div>
            <div className="glassmorphism-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">სათაური</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">რიგი</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">აქტიური</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-cyan-300 uppercase tracking-wider">ქმედებები</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {(slidesData?.slides || []).map((s: SlideType) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors align-middle">
                        <td className="px-6 py-4 text-white font-semibold">{s.title}</td>
                        <td className="px-6 py-4 text-blue-200">{s.order}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${s.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {s.isActive ? 'აქტიური' : 'არააქტიური'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditSlideModal(s)} className="text-green-400 hover:text-green-300 p-2 hover:bg-green-500/20 rounded-lg transition-all">
                              <FaEdit />
                            </button>
                            <button onClick={async () => { await deleteSlideMutation(s.id); toast.success('წაიშალა'); refetchSlides(); }} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {isSlideModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="glassmorphism-card w-full max-w-3xl p-6">
                  <h3 className="text-2xl font-black text-white mb-4">{editingSlideId ? 'სლაიდის რედაქტირება' : 'ახალი სლაიდი'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">სათაური</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.title || ''} onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">ქვესათაური</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.subtitle || ''} onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-white mb-2">აღწერა</label>
                      <textarea className="w-full px-4 py-3 glassmorphism-button text-white h-24" value={slideForm.description || ''} onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">YouTube URL</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.youtubeUrl || ''} onChange={(e) => setSlideForm({ ...slideForm, youtubeUrl: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">სურათის URL</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.imageUrl || ''} onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">ძირ. ღილაკი — ტექსტი</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.primaryButtonText || ''} onChange={(e) => setSlideForm({ ...slideForm, primaryButtonText: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">ძირ. ღილაკი — ბმული</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.primaryButtonUrl || ''} onChange={(e) => setSlideForm({ ...slideForm, primaryButtonUrl: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">მეორ. ღილაკი — ტექსტი</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.secondaryButtonText || ''} onChange={(e) => setSlideForm({ ...slideForm, secondaryButtonText: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">მეორ. ღილაკი — ბმული</label>
                      <input className="w-full px-4 py-3 glassmorphism-button text-white" value={slideForm.secondaryButtonUrl || ''} onChange={(e) => setSlideForm({ ...slideForm, secondaryButtonUrl: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">რიგი</label>
                      <input type="number" className="w-full px-4 py-3 glassmorphism-button text-white" value={Number(slideForm.order) || 0} onChange={(e) => setSlideForm({ ...slideForm, order: Number(e.target.value) })} />
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <input type="checkbox" checked={Boolean(slideForm.isActive)} onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })} />
                      <span className="text-white text-sm">აქტიური</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={closeSlideModal} className="glassmorphism-button px-6 py-3 text-white">გაუქმება</button>
                    <button onClick={saveSlide} className="gradient-primary px-6 py-3 rounded-xl text-white font-bold">შენახვა</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'custom-orders' ? (
          <CustomOrdersSection />
        ) : activeTab === 'gallery' ? (
          <GallerySection />
        ) : null}
      </div>

      {/* Add Product Modal */}
      <ProductForm
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSubmit={handleCreateProduct}
        title="ახალი პროდუქტის დამატება"
        submitButtonText="პროდუქტის შექმნა"
      />

      {/* Edit Product Modal */}
      <ProductForm
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
        product={editingProduct}
        title="პროდუქტის რედაქტირება"
        submitButtonText="პროდუქტის განახლება"
      />

      {/* Order Details Modal */}
      {orderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glassmorphism-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedOrder.orderId}</h2>
                  <p className="text-blue-200 text-sm mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString('ka-GE')}
                  </p>
                </div>
                <button
                  onClick={() => setOrderDetailsOpen(false)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedOrder.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  selectedOrder.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                  selectedOrder.status === 'shipped' ? 'bg-purple-500/20 text-purple-300' :
                  selectedOrder.status === 'delivered' ? 'bg-green-500/20 text-green-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  სტატუსი: {selectedOrder.status === 'pending' ? 'მოლოდინში' :
                    selectedOrder.status === 'processing' ? 'დამუშავება' :
                    selectedOrder.status === 'shipped' ? 'გაგზავნილი' :
                    selectedOrder.status === 'delivered' ? 'მიტანილი' :
                    selectedOrder.status === 'cancelled' ? 'გაუქმებული' : selectedOrder.status}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedOrder.paymentMethod === 'online' ? 'bg-blue-500/20 text-blue-300' :
                  selectedOrder.paymentMethod === 'bank_transfer' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  გადახდა: {selectedOrder.paymentMethod === 'online' ? 'Online (TBC)' : 
                    selectedOrder.paymentMethod === 'bank_transfer' ? 'საბანკო გადარიცხვა' : 
                    'ნაღდი ფული'}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedOrder.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-300' :
                  selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  გადახდის სტატუსი: {selectedOrder.paymentStatus === 'completed' ? 'დასრულებული' :
                    selectedOrder.paymentStatus === 'pending' ? 'მოლოდინში' : 'წარუმატებელი'}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">კლიენტის ინფორმაცია</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-200">სახელი:</span>
                    <span className="text-white ml-2 font-semibold">
                      {selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-200">ტელეფონი:</span>
                    <span className="text-white ml-2 font-semibold">{selectedOrder.customerInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">ელ-ფოსტა:</span>
                    <span className="text-white ml-2 font-semibold">{selectedOrder.customerInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">პირადი ნომერი:</span>
                    <span className="text-white ml-2 font-semibold">{selectedOrder.customerInfo.documentNumber}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-blue-200">მისამართი:</span>
                    <span className="text-white ml-2 font-semibold">{selectedOrder.customerInfo.address}</span>
                  </div>
                  {selectedOrder.customerInfo.comment && (
                    <div className="md:col-span-2">
                      <span className="text-blue-200">კომენტარი:</span>
                      <span className="text-white ml-2">{selectedOrder.customerInfo.comment}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">შეკვეთილი პროდუქტები</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white/5 rounded-lg p-3">
                      {item.image && (
                        <img 
                          src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${item.image}`} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        {(item as any).variation && (
                          <p className="text-blue-200 text-sm">
                            ფერი: {(item as any).variation.color} | ზომა: {(item as any).variation.size}
                          </p>
                        )}
                        <p className="text-blue-200 text-sm">რაოდენობა: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">₾{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">ჯამური თანხა:</span>
                  <span className="text-2xl font-black text-cyan-300">₾{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  disabled={deletingOrderId === selectedOrder.id}
                  className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30 flex items-center gap-2"
                >
                  <FaTrash />
                  {deletingOrderId === selectedOrder.id ? 'იშლება...' : 'წაშლა'}
                </button>
                <button
                  onClick={() => setOrderDetailsOpen(false)}
                  className="glassmorphism-button px-6 py-2 text-white"
                >
                  დახურვა
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
