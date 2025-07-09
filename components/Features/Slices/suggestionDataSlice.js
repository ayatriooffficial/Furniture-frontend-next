import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  suggestion: {},
};

export const suggestionDataSlice = createSlice({
  name: "suggestionData",
  initialState,
  reducers: {
    loadSuggestionDataFetch: (state) => {
      state.status = "loading";
    },
    getSuggestionDataSuccess: (state, action) => {
      state.suggestion = action.payload;
      state.status = "succeeded";
    },
    getSuggestionDataFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const {
  loadSuggestionDataFetch,
  getSuggestionDataSuccess,
  getSuggestionDataFailure,
} = suggestionDataSlice.actions;

export const selectSuggestionData = (state) => state.suggestionData.suggestion;
export const selectSuggestionStatus = (state) => state.suggestionData.status;

export default suggestionDataSlice.reducer;
