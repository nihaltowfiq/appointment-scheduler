import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  uid: string | null;
  username: string | null;
  name: string | null;
  occupation: string | null;
}

const initialState: UserState = {
  uid: null,
  username: null,
  name: null,
  occupation: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.uid = null;
      state.username = null;
      state.name = null;
      state.occupation = null;
    },
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.uid = action.payload.uid;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.occupation = action.payload.occupation;
    },
  },
});

export const { clearUser, updateUser } = appSlice.actions;
export default appSlice.reducer;
export const getAppState = (state: RootState) => state.app;
