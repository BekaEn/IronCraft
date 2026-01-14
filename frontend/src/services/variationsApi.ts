import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ProductVariation {
  id?: number;
  productId: number;
  color: string;
  size: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  isActive: boolean;
}

export const variationsApi = createApi({
  reducerPath: 'variationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Variations'],
  endpoints: (builder) => ({
    getProductVariations: builder.query<ProductVariation[], number>({
      query: (productId) => `/products/${productId}/variations`,
      providesTags: (result, error, productId) => [{ type: 'Variations', id: productId }],
    }),
  }),
});

export const { useGetProductVariationsQuery } = variationsApi;
