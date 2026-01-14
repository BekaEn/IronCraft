export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string[];
  price: string; // API returns price as string
  stock: number;
  thumbnail?: string;
  images: string[];
  features: string[];
  specifications: {
    material?: string;
  };
  category: string;
  isActive: boolean;
  isOnSale?: boolean;
  salePrice?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin: boolean;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface PaymentData {
  amount: number;
  currency: 'GEL';
  orderId: string;
  description: string;
  returnUrl: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}
