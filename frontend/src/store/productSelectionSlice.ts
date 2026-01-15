import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductVariation } from '../services/variationsApi';
import type { RootState } from './store';

interface ProductSelectionState {
  selectedVariation: ProductVariation | null;
  quantity: number;
}

const initialState: ProductSelectionState = {
  selectedVariation: null,
  quantity: 1,
};

const productSelectionSlice = createSlice({
  name: 'productSelection',
  initialState,
  reducers: {
    setSelectedVariation: (state, action: PayloadAction<ProductVariation | null>) => {
      state.selectedVariation = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    resetProductSelection: (state) => {
      state.selectedVariation = null;
      state.quantity = 1;
    },
  },
});

export const { setSelectedVariation, setQuantity, resetProductSelection } = productSelectionSlice.actions;

export const selectProductSelection = (state: RootState) => state.productSelection;
export const selectSelectedVariation = (state: RootState) => state.productSelection.selectedVariation;
export const selectQuantity = (state: RootState) => state.productSelection.quantity;

export default productSelectionSlice.reducer;
