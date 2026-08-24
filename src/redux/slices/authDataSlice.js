import { getDecodedToken } from '@/utils/helpers';
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';



export const authDataSlice = createSlice({
  name: 'authData',
  initialState: {
    authData: getDecodedToken(),
    auth: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  },
  reducers: {
    setAuthData: (state, action) => {
      const { token, refreshToken } = action.payload || {};
      let decoded = {};

      if (token) {
        try {
          decoded = jwtDecode(token);
        } catch (e) {
          console.error("Failed to decode token in setAuthData:", e);
        }
      }

      state.authData = decoded;
      state.auth = !!token;
      state.token = token || null;
      state.refreshToken = refreshToken || null;

      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    },

    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.auth = false;
      state.authData = {};
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setAuthData, logout } = authDataSlice.actions;

export default authDataSlice.reducer;
