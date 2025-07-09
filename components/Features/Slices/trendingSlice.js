import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  trendingData: [],
};

export const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    loadTrendingFetch: (state) => {
      state.status = "loading";
    },
    getTrendingSuccess: (state, action) => {
      state.trendingData = action.payload;
      state.status = "succeeded";
    },
    getTrendingFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const {loadTrendingFetch, getTrendingSuccess, getTrendingFailure} = trendingSlice.actions

export const selectTrendingData = (state) => state.trending.trendingData;
export const selectTrendingStatus = (state) => state.trending.status;

export default trendingSlice.reducer;