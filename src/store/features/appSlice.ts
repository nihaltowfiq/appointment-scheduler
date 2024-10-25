import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import { RootState } from '../store';

interface UserState {
  uid: string | null;
  email: string | null;
  loading: boolean;
}

const initialState: UserState = {
  uid: null,
  email: null,
  loading: false,
};

// Async thunk to fetch user info from Firebase by calling API route
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async () => {
    const response = await axios.get('/api/user');

    console.log(response);

    if (response.status === 401) {
      deleteCookie('token');
      redirect('/signin');
    }
    return response.data.user;
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
    },
    saveUser: (
      state,
      action: PayloadAction<{ uid: string; email: string }>
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUserInfo.fulfilled,
        (state, action: PayloadAction<{ uid: string; email: string }>) => {
          state.uid = action.payload.uid;
          state.email = action.payload.email;
          state.loading = false;
        }
      )
      .addCase(fetchUserInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearUser, saveUser } = appSlice.actions;
export default appSlice.reducer;
export const getAppState = (state: RootState) => state.app;
