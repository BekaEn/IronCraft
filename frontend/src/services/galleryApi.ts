import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export interface GalleryImage {
  id: number;
  title?: string;
  description?: string;
  imagePath: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Gallery'],
  endpoints: (builder) => ({
    getGalleryImages: builder.query<GalleryImage[], { includeInactive?: boolean }>({
      query: ({ includeInactive } = {}) => ({
        url: '/gallery',
        params: includeInactive ? { includeInactive: 'true' } : undefined,
      }),
      providesTags: ['Gallery'],
    }),
    uploadGalleryImage: builder.mutation<{ message: string; image: GalleryImage }, FormData>({
      query: (formData) => ({
        url: '/gallery',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryImage: builder.mutation<{ message: string; image: GalleryImage }, { id: number; data: Partial<GalleryImage> }>({
      query: ({ id, data }) => ({
        url: `/gallery/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Gallery'],
    }),
    reorderGallery: builder.mutation<{ message: string }, { orders: { id: number; sortOrder: number }[] }>({
      query: (body) => ({
        url: '/gallery/reorder/bulk',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Gallery'],
    }),
    deleteGalleryImage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryImagesQuery,
  useUploadGalleryImageMutation,
  useUpdateGalleryImageMutation,
  useReorderGalleryMutation,
  useDeleteGalleryImageMutation,
} = galleryApi;
