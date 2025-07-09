import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  profileData: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfileFetch: (state) => {
      state.status = "loading";
    },
    getProfileSuccess: (state, action) => {
      state.profileData = action.payload;
      state.status = "succeeded";
    },
    getProfileFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const { loadProfileFetch, getProfileSuccess, getProfileFailure } =
  profileSlice.actions;

export const selectProfileData = (state) => state.profile.profileData;
export const selectProfileStatus = (state) => state.profile.status;

export default profileSlice.reducer;
