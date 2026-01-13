import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export interface SiteSettings {
  id: number;
  promoEnabled: boolean;
  promoText: string;
  promoYoutubeUrl?: string | null;
  promoYoutubeTitle?: string | null;
  promoYoutubeThumbnail?: string | null;
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/settings`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<SiteSettings, void>({
      query: () => '',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
      query: (body) => ({ url: '', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;

