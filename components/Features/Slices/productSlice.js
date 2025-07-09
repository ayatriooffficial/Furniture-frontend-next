// allProductsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "idle",
    allProductsData: null,
    loader: false
};

export const allProductsSlice = createSlice({
    name: "allProducts",
    initialState,
    reducers: {
        setAllProducts: (state, action) => {
            state.allProductsData = action.payload;
        },
        allProductsLoader: (state, action) => {
            state.loader = action.payload;
        },
        fetchAllProductsRequest: (state) => {
            state.status = 'loading';
        },
    },
});

export const {
    setAllProducts,
    allProductsLoader,
    fetchAllProductsRequest,
} = allProductsSlice.actions;

export const selectAllProducts = (state) => state.allProducts.allProductsData;
export const selectAllProductsLoader = (state) => state.allProducts.loader;

export default allProductsSlice.reducer;
