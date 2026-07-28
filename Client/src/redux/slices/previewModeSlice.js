import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPreviewMode: false,
};

const previewModeSlice = createSlice({
  name: "previewMode",
  initialState,
  reducers: {
    enterPreviewMode: (state) => {
      state.isPreviewMode = true;
    },
    exitPreviewMode: (state) => {
      state.isPreviewMode = false;
    },
  },
});

export const { enterPreviewMode, exitPreviewMode } = previewModeSlice.actions;
export default previewModeSlice.reducer;
