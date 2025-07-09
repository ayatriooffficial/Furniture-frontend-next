import { createSlice } from "@reduxjs/toolkit";

const selectedItemsSlice = createSlice({
  name: "selectedItems",
  initialState: { items1: [], items2: [], items3: [] },
  reducers: {
    setSelectedcomItems1: (state, action) => {
      state.items1 = action.payload.items1;
    },
    setSelectedcomItems2: (state, action) => {
      state.items2 = action.payload.items2;
    },
    setSelectedcomItems3: (state, action) => {
      state.items3 = action.payload.items3;
    },
  },
});

export const {
  setSelectedcomItems1,
  setSelectedcomItems2,
  setSelectedcomItems3,
} = selectedItemsSlice.actions;
//   export const selecteditem=((state)=>state.selectedItems)
export const Items1selected = (state) => state.selectedItems.items1;
export const Items2selected = (state) => state.selectedItems.items2;
export const Items3selected = (state) => state.selectedItems.items3;
export default selectedItemsSlice.reducer;
