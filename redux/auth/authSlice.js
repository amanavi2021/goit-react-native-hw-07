import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  login: null,
  stateChanged: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChanged: payload.stateChanged,
    }),
    authSignOut: (state) => ({
      ...state,
      userId: null,
      login: null,
      stateChanged: false,
    }),
  },
});
