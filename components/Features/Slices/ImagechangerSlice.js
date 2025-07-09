import { createSlice } from "@reduxjs/toolkit";

const ImagechangerSlice = createSlice({
  name: "Imagechanger",
  initialState: {
    imgchangeritem: [],
  },
  reducers: {
    setImagechanger: (state, action) => {
      state.imgchangeritem = action.payload;
    },
  },
});

export const { setImagechanger } = ImagechangerSlice.actions;
export const selectedImagechanger = (state) =>
  state.Imagechanger.imgchangeritem;

// export const ImagechangerReducer = ImagechangerSlice.reducer;

export default ImagechangerSlice.reducer;
