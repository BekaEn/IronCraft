import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '../services/productsApi';
import { settingsApi } from '../services/settingsApi';
import { heroSlidesApi } from '../services/heroSlidesApi';
import { customOrdersApi } from '../services/customOrdersApi';
import { variationsApi } from '../services/variationsApi';
import { galleryApi } from '../services/galleryApi';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [heroSlidesApi.reducerPath]: heroSlidesApi.reducer,
    [customOrdersApi.reducerPath]: customOrdersApi.reducer,
    [variationsApi.reducerPath]: variationsApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware, 
      settingsApi.middleware, 
      heroSlidesApi.middleware, 
      customOrdersApi.middleware,
      variationsApi.middleware,
      galleryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;