import { configureStore } from '@reduxjs/toolkit';
import viewSectionReducer from './slice/view-section-slice';
import addSectionReducer from './slice/add-section-slice';
import editSectionReducer from './slice/edit-section-slice';

export const store = configureStore({
  reducer: {
    viewSection: viewSectionReducer,
    addSection: addSectionReducer,
    editSection: editSectionReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
