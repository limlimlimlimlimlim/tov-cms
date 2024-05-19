import { configureStore } from '@reduxjs/toolkit';
import addSectionReducer from './slice/add-section-slice';

export const store = configureStore({
  reducer: {
    addSection: addSectionReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
