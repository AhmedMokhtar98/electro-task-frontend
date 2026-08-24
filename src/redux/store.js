import { configureStore } from '@reduxjs/toolkit';
import authDataReducer from './slices/authDataSlice';

export const store = configureStore({
  reducer: {
    authData: authDataReducer,
  }
});