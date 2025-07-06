// redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfos: {},  // stocker les données entre les étapes
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerStepSuccess: (state, action) => {
      state.userInfos = { ...state.userInfos, ...action.payload };
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetRegister: (state) => {
      state.userInfos = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const { registerStart, registerStepSuccess, registerFailure, resetRegister } = authSlice.actions;
export default authSlice.reducer;
