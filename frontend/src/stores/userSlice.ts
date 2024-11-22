// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: null | { name: string; phone: string; email: string };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<{ name: string; phone: string; email: string }>) {
      state.loading = false;
      state.user = action.payload;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { registerRequest, registerSuccess, registerFailure } = userSlice.actions;
export default userSlice.reducer;
