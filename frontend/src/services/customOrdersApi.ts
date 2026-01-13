import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export interface CustomOrder {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  designImage: string;
  width: string;
  height: string;
  quantity: number;
  additionalDetails?: string;
  status: 'pending' | 'in_review' | 'approved' | 'in_production' | 'completed' | 'cancelled';
  estimatedPrice?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomOrdersResponse {
  orders: CustomOrder[];
  totalPages: number;
  currentPage: number;
  totalOrders: number;
}

export const customOrdersApi = createApi({
  reducerPath: 'customOrdersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/custom-orders`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['CustomOrder'],
  endpoints: (builder) => ({
    createCustomOrder: builder.mutation<{ message: string; order: CustomOrder }, FormData>({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['CustomOrder'],
    }),
    getCustomOrders: builder.query<CustomOrdersResponse, { status?: string; page?: number; limit?: number }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        return `?${searchParams.toString()}`;
      },
      providesTags: ['CustomOrder'],
    }),
    getCustomOrderById: builder.query<CustomOrder, number>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'CustomOrder', id }],
    }),
    updateCustomOrder: builder.mutation<{ message: string; order: CustomOrder }, { id: number; data: Partial<CustomOrder> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'CustomOrder', id }],
    }),
    deleteCustomOrder: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomOrder'],
    }),
  }),
});

export const {
  useCreateCustomOrderMutation,
  useGetCustomOrdersQuery,
  useGetCustomOrderByIdQuery,
  useUpdateCustomOrderMutation,
  useDeleteCustomOrderMutation,
} = customOrdersApi;
