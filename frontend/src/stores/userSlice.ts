// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: null | { name: string; email: string };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: { id: string; name: string; email: string }; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info
      localStorage.setItem('token', action.payload.token); // Store token
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user'); // Remove user info
      localStorage.removeItem('token'); // Remove token
    },
    registerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<{ user: { name: string; phone: string; email: string }; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info
      localStorage.setItem('token', action.payload.token); // Store token
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    googleLoginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    googleLoginSuccess(state, action: PayloadAction<{ user: { id: string; name: string; email: string }; token: string }>) {
      state.user = action.payload.user;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user info
      localStorage.setItem('token', action.payload.token); // Store token
    },
    googleLoginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { registerRequest, registerSuccess, registerFailure,loginRequest, loginSuccess, loginFailure, googleLoginRequest, googleLoginSuccess, googleLoginFailure ,logout } = userSlice.actions;
export default userSlice.reducer;
