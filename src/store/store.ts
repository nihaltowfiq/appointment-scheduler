import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appSlice from './features/appSlice';

const combineReducer = combineReducers({
  app: appSlice,
});

export const store = configureStore({
  reducer: combineReducer,
});

export const makeStore = () => {
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
