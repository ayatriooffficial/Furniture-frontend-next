import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: {},
  room: {},
  budget: {},
  color: {},
  subcategory: {},
  style: {},
  mode:{},
  name:"",
  phoneNumber:"",
};

const selectedDataSlice = createSlice({
  name: "selectedData",
  initialState,
  reducers: {
    setSelectedRoom(state, action) {
      state.room = action.payload;
    },
    setSelectedBudget(state, action) {
      state.budget = action.payload;
    },
    setSelectedColor(state, action) {
      state.color = action.payload;
    },
    setSelectedSubcategory(state, action) {
      state.subcategory = action.payload;
    },
    setSelectedStyle(state, action) {
      state.style = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSelectedMode(state,action){
      state.mode=action.payload;
    },
    setselectedName(state,action){
      state.name=action.payload;
    },
    setSelectedPhoneNumber(state,action){
      state.phoneNumber=action.payload;
    }
    
  },
});

export const {
  setSelectedRoom,
  setSelectedBudget,
  setSelectedColor,
  setSelectedSubcategory,
  setSelectedStyle,
  setCategory,
  setSelectedMode,
  setselectedName,
  setSelectedPhoneNumber,
} = selectedDataSlice.actions;

export const selectRoom = (state) => state.virtualData.room;
export const selectBudget = (state) => state.virtualData.budget;
export const selectColor = (state) => state.virtualData.color;
export const selectSubcategory = (state) => state.virtualData?.subcategory;
export const selectStyle = (state) => state.virtualData.style;
export const selectCategory = (state) => state.virtualData.category;
export const selectData = (state) => state.virtualData;
export const allSelectedData = (state) => state.virtualData;

export default selectedDataSlice.reducer;
