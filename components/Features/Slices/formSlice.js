// formSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    first: "",
    last: "",
    add1: "",
    add2: "",
    add3: "",
    postal: "",
    local: "",
    state: "",
    country: "",
    email: "",
    number: "",
    pan: "",
    selectedDate: "",
    selectedTime: "",
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
});

export const { updateFormData, updateSelectedDateTime } = formSlice.actions;
export const selectFormData = (state) => state.form.formData;

export default formSlice.reducer;
