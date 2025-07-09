import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  blogCardData: [],
};

export const blogCardSlice = createSlice({
  name: "blogCard",
  initialState,
  reducers: {
    loadBlogCardFetch: (state) => {
      state.status = "loading";
    },
    getBlogCardSuccess: (state, action) => {
      state.blogCardData = action.payload;
      state.status = "succeeded";
    },
    getBlogCardFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const {loadBlogCardFetch, getBlogCardSuccess, getBlogCardFailure} = blogCardSlice.actions

export const selectBlogCardData = (state) => state.blogCard.blogCardData;
export const selectBlogCardStatus = (state) => state.blogCard.status;

export default blogCardSlice.reducer;