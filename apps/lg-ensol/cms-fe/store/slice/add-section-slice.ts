import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Position, Section } from '../../interface/section';

export interface AddSectionState {
  newSections: Section[][];
}

const initialState: any = {
  newSections: [],
};

export const addSectionSlice = createSlice({
  name: 'addSection',
  initialState,
  reducers: {
    addNewSection: (state, action: PayloadAction<Section>) => {
      state.newSections.push(action.payload);
    },
    updateSection: (
      state,
      action: PayloadAction<{
        id: string;
        pointIndex: number;
        point: Position;
      }>,
    ) => {
      state.newSections.find((s) => s.id === action.payload.id).path[
        action.payload.pointIndex
      ] = action.payload.point;
    },
    clearNewSections: (state) => {
      state.newSections = [];
    },
  },
});

export const { addNewSection, updateSection, clearNewSections } =
  addSectionSlice.actions;

export default addSectionSlice.reducer;
