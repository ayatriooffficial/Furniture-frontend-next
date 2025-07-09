// roomSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  loader: false,
  roomData: [],
};

export const roomSlice = createSlice({
  name: "roomdetails",
  initialState,
  reducers: {
    setRoomData: (state, action) => {
      // console.log('Action:', action); // Log the action
      // console.log('State before:', state); // Log the state before it's updated
      state.roomData = action.payload.roomData;
      state.status = "succeeded";
    },
    resetRoomData: (state) => {
      state.roomData = [];
      state.status = "idle";
    },
  },
});

export const { setRoomData, resetRoomData } = roomSlice.actions;
export const selectRoomData = (state) => state.roomdetails.roomData;
export const selectRoomStatus = (state) => state.roomdetails.status;

export default roomSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   status: 'idle',
//   loader: false,
//   roomData: [],
// };

// export const roomSlice = createSlice({
//   name: 'room',
//   initialState,
//   reducers: {
//     loadRoomFetch: (state) => {
//       state.status = 'loading';
//     },
//     getRoomSuccess: (state, action) => {
//       state.roomData = action.payload;
//       state.status = 'succeeded';
//     },
//     getRoomFailure: (state) => {
//       state.status = 'failed';
//     },
//   },
// });

// export const { loadRoomFetch, getRoomSuccess, getRoomFailure } = roomSlice.actions;

// export const selectRoomData = (state) => state.room.roomData;
// export const selectRoomStatus = (state) => state.room.status;

// export default roomSlice.reducer;
