import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Order, Address } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: Address;
}

interface PaymentRequest {
  orderId: number;
  returnUrl: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  redirectUrl?: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation<Order, { id: number; status: Order['status'] }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Order', id }],
    }),
    initiatePayment: builder.mutation<PaymentResponse, PaymentRequest>({
      query: (paymentData) => ({
        url: '/payments/initiate',
        method: 'POST',
        body: paymentData,
      }),
    }),
    getPaymentStatus: builder.query<any, string>({
      query: (transactionId) => `/payments/status/${transactionId}`,
    }),
    deleteOrder: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useDeleteOrderMutation,
} = ordersApi;
