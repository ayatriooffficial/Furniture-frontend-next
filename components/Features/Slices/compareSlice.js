import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  pdtselected: [],
};

export const selectedproductslice = createSlice({
  name: "selectedproduct",
  initialState,
  reducers: {
    setselectedproduct: (state, action) => {
      // console.log("Reducer: Setting selected product", action.payload);
      state.pdtselected = action.payload;
      state.status = "succeeded";
    },
    resetselectedproduct: (state) => {
      state.pdtselected = [];
      state.status = "idle";
    },
  },
});
export const { setselectedproduct, resetselectedproduct } =
  selectedproductslice.actions;

export const selectproductdata = (state) =>
  state.selectedproduct.pdtselected;
export const selectproductstatus = (state) => state.selectedproduct.status;

export default selectedproductslice.reducer;
