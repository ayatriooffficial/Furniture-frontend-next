import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  firstImgChangerData: [],
};

export const firstChangerSlice = createSlice({
  name: "firstImageChanger",
  initialState,
  reducers: {
    loadFirstImgChangerFetch: (state) => {
      state.status = "loading";
    },
    getFirstImgChangerSuccess: (state, action) => {
      state.firstImgChangerData = action.payload;
      state.status = "succeeded";
    },
    getFirstImgChangerFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const { loadFirstImgChangerFetch, getFirstImgChangerSuccess, getFirstImgChangerFailure } =
  firstChangerSlice.actions;

export const selectFirstImgChangerData = (state) => state.firstImageChanger.firstImgChangerData;
export const selectFirstImgChangerStatus = (state) => state.firstImageChanger.status;

export default firstChangerSlice.reducer;
