import { createSlice } from '@reduxjs/toolkit';

import type { AuthState, AuthUser } from '@/types/store';

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  rehydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (
      state,
      action: {
        payload: {
          accessToken: string;
          refreshToken: string;
          user: AuthUser;
        };
      },
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    clearSession: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setRehydrated: state => {
      state.rehydrated = true;
    },
  },
});

export const { setSession, clearSession, setRehydrated } = authSlice.actions;
export default authSlice.reducer;
