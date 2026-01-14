import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Inline types to avoid import issues
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string[];
  price: string;
  stock: number;
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

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/products`,
    prepareHeaders: (headers) => {
      // Get token from localStorage for authenticated requests
      const token = localStorage.getItem('token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getCategories: builder.query<{ categories: { category: string; count: number }[] }, void>({
      query: () => `/categories/list`,
    }),
    getProducts: builder.query<ProductsResponse, {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      priceMin?: number;
      priceMax?: number;
    }>({
      query: (params = {}) => {
        console.log('🚀 Fetching real data from MySQL database...');
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        return `?${searchParams.toString()}`;
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, string | number>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, Partial<Product> & { images?: FileList }>({
      query: (productData) => {
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
          if (key === 'images' && value instanceof FileList) {
            Array.from(value).forEach((file) => {
              formData.append('images', file);
            });
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
        return {
          url: '',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: number; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
