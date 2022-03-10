import { createSlice } from '@reduxjs/toolkit';

const loopAndSetValues = (obj1, obj2) => {
  for (let key in obj2) {
    obj1[key] = obj2[key];
  }
};

export const sourceSlice = createSlice({
  name: 'source',
  initialState: {
    isFormShowed: false,
    formInterface: {},
  },
  reducers: {
    setIsFormShowed: (state, action) => {
      state.isFormShowed = action.payload;
    },
    setFormInterface: (state, action) => {
      state.formInterface.title = action.payload.title;
      state.formInterface.btn = action.payload.btn;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsFormShowed,
  setFormInterface,
  setSourceOnProcess,
  setCurrentPage,
} = sourceSlice.actions;

export default sourceSlice.reducer;
