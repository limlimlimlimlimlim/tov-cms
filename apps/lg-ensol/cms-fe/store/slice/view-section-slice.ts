import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Section } from '../../interface/section';

export interface ViewSectionState {
  viewSections: Record<string, Section>;
}

const initialState: any = {
  viewSections: {},
};

export const viewSectionSlice = createSlice({
  name: 'viewSection',
  initialState,
  reducers: {
    setViewSections: (state, action: PayloadAction<Section[]>) => {
      state.viewSections = action.payload;
    },
  },
});

export const { setViewSections } = viewSectionSlice.actions;

export default viewSectionSlice.reducer;
