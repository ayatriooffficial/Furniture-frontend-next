import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    dbItems: null, // items fetched from the database
    orderId: null,
  },
  reducers: {
    setDbItems: (state, action) => {
      state.dbItems = action.payload;
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
  },
});

export const { setDbItems, setOrderId } = cartSlice.actions;
// export const {  } = cartSlice.actions

export const selecteddbItems = (state) => state.cart.dbItems;

export const selectedorderid = (state) => state.cart.orderId;

export default cartSlice.reducer;
