import { createSlice } from '@reduxjs/toolkit';
export const hrReviewSlide = createSlice({
  name: 'hr-review',
  initialState: {
    data: [],
  },
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setData } = hrReviewSlide.actions;

export default hrReviewSlide.reducer;
