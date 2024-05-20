import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Section } from '../../interface/section';

export interface AddSectionState {
  editSections: Record<string, Section>;
}

const initialState: any = {
  editSections: {},
};

export const editSectionSlice = createSlice({
  name: 'editSection',
  initialState,
  reducers: {
    addEditSection: (state, action: PayloadAction<Section>) => {
      if (!action.payload.id) return;
      state.editSections[action.payload.id] = action.payload;
    },
    clearEidtSections: (state) => {
      state.editSections = {};
    },
  },
});

export const { addEditSection, clearEidtSections } = editSectionSlice.actions;

export default editSectionSlice.reducer;
