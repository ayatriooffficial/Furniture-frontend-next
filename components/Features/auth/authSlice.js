import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: [],
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload
    },
    unAuthenticateUser: (state, action) => {
      state.isAuthenticated = false;
      state.user = []
    },
  },
});

export const { authenticateUser, unAuthenticateUser } = AuthSlice.actions;

export const selectAuthStatus = (state) => state.auth.isAuthenticated;
export const selectAuthenticatedUser = (state) => state.auth.user;

export default AuthSlice.reducer;
