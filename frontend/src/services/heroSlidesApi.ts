import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  youtubeUrl?: string | null;
  imageUrl?: string | null;
  order: number;
  isActive: boolean;
}

export const heroSlidesApi = createApi({
  reducerPath: 'heroSlidesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['HeroSlides'],
  endpoints: (builder) => ({
    getSlides: builder.query<{ slides: HeroSlide[] }, void>({
      query: () => '/hero-slides',
      providesTags: ['HeroSlides'],
    }),
    createSlide: builder.mutation<HeroSlide, Partial<HeroSlide>>({
      query: (body) => ({
        url: '/hero-slides',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['HeroSlides'],
    }),
    updateSlide: builder.mutation<HeroSlide, { id: number; data: Partial<HeroSlide> }>({
      query: ({ id, data }) => ({
        url: `/hero-slides/${id}`,
        method: 'PUT',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['HeroSlides'],
    }),
    deleteSlide: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/hero-slides/${id}`, method: 'DELETE' }),
      invalidatesTags: ['HeroSlides'],
    }),
  }),
});

export const { useGetSlidesQuery, useCreateSlideMutation, useUpdateSlideMutation, useDeleteSlideMutation } = heroSlidesApi;


