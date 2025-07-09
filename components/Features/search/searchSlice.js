
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'productWithSearch',
  initialState,
  reducers: {
    searchProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchProductsSuccess: (state, action) => {
      state.products = action.payload.data;
      state.loading = false;
    },
    searchProductsFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },
  },
});

export const {
  searchProductsRequest,
  searchProductsSuccess,
  searchProductsFailure,
} = searchSlice.actions;

export const selectProducts = (state) => state.productWithSearch.products

export default searchSlice.reducer;
