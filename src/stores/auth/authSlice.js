import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInWithGoogleStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signInWithGoogleSuccess: (state, action) => {
      state.isLoading = false;
      const { uid, displayName, email, photoURL } = action.payload;
      state.user = { uid, displayName, email, photoURL };
      state.error = null;
    },
    signInWithGoogleFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInWithGoogleStart,
  signInWithGoogleSuccess,
  signInWithGoogleFailure,
} = authSlice.actions;

export default authSlice.reducer;
