import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  // recommendedCategoryWiseProductData:null,
  productCategories: {},
  hasMoreCategories: false,
  loader:false
};

export const recommendationCategoryWiseSlice = createSlice({
  name: "recommendedCategoryWiseProduct",
  initialState,
  reducers: {
    recommendCategoryWiseProduct: (state, action) => {
      const { categories, hasMoreCategories } = action.payload.recommendations;
      state.productCategories = { ...state.productCategories, ...categories };
      state.hasMoreCategories = hasMoreCategories;
      state.status = "succeeded"; // ✅ Mark status as succeeded
    },
    recommendationCategoryWiseLoader: (state, action) => {
      state.loader = action.payload;
    },
    fetchRecommendationCategoryWiseRequest: (state) => {
      state.status = "loading"; // ✅ Mark status as loading
    },
    fetchRecommendationCategoryWiseFailure: (state) => {
      state.status = "failed"; // ✅ Mark status as failed
    },
  },
});

export const {
  recommendCategoryWiseProduct,
  recommendationCategoryWiseLoader,
  fetchRecommendationCategoryWiseRequest,
  fetchRecommendationCategoryWiseFailure,
} = recommendationCategoryWiseSlice.actions;


// export const selectRecommendedCategoryWiseProduct = (state) => state.recommendedCategoryWiseProduct.recommendedCategoryWiseProductData;
export const selectRecommendedCategoryWiseProduct = (state) => state.recommendedCategoryWiseProduct.productCategories;
export const selectRecommendationCategoryWiseLoader = (state) => state.recommendedCategoryWiseProduct.loader;
export const selectRecommendationCategoryWiseStatus = (state) => state.recommendedCategoryWiseProduct.status;

export default recommendationCategoryWiseSlice.reducer;


