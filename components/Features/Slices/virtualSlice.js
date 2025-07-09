import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    status: "idle",
    loader: false,
    virtualData: [],
    };
export const virtualSlice = createSlice({
    name: "virtual",
    initialState,
    reducers: {
        getsVirtualFetch: (state) => {
            state.status = "loading";
        },
        getVirtualSuccess: (state, action) => {
            state.virtualData = action.payload;
            state.status = "succeeded";
        },
        getVirtualFailure: (state) => {
            state.status = "failed";
        },
        getData: (state) => {
            return state.virtualData;
        },
        fetchVirtualRequest: (state, action) => {
            state.loader = action.payload;
        },
    },
});
export const {
    getsVirtualFetch,
    fetchVirtualRequest,
    getVirtualSuccess,
    getVirtualFailure,
} = virtualSlice.actions;
export const selectVirtualData = (state) => state.virtual.virtualData;
export const selectVirtualLoader = (state) => state.virtual.loader;
export const selectVirtualStatus = (state) => state.virtual.status; 
export default virtualSlice.reducer;