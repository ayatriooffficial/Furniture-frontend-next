import { createSlice } from "@reduxjs/toolkit";

const DisplaySlice = createSlice({
  name: "Display",
  initialState: {
    displayData: [],
  },
  reducers: {
    setDisplayData: (state, action) => {
      state.displayData = action.payload;
    },
  },
});

export const { setDisplayData } = DisplaySlice.actions;
export const selectedDisplayData = (state) => state.Display.displayData;

export default DisplaySlice.reducer;
