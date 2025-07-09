import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  musicData: [],
};

export const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    loadMusicFetch: (state) => {
      state.status = "loading";
    },
    getMusicSuccess: (state, action) => {
      state.musicData = action.payload;
      state.status = "succeeded";
    },
    getMusicFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const { loadMusicFetch, getMusicSuccess, getMusicFailure } = musicSlice.actions;

export const selectMusicData = (state) => state.music.musicData;

export default musicSlice.reducer;
