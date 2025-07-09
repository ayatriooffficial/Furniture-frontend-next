import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loader: false,
  data: [],
};

export const FirstCardSlice = createSlice({
  name: 'FirstCard',
  initialState,
  reducers: {
    FirstCardLoader: (state, action) => {
      state.loader = action.payload;
    },
    FirstCardData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { FirstCardLoader, FirstCardData } = FirstCardSlice.actions;

export const CardLoader = (state) => state.FirstCard.loader;
export const CardData = (state) => state.FirstCard.data;

export default FirstCardSlice.reducer;
