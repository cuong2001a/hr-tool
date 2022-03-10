import { createSlice } from '@reduxjs/toolkit';

export const Level = createSlice({
  name: 'Level',
  initialState: {
    formContent: {},
    visible: false,
    reloadTable: false,
    totalPage: 0,
    pageSize: 10,
    searchQuery: '',
  },
  reducers: {
    setVisibles: (state, action) => {
      state.visible = action.payload;
    },
    setReloadTable: state => {
      state.reloadTable = !state.reloadTable;
    },
    setTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
    searchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFormContent: (state, action) => {
      state.formContent.title = action.payload.title;
      state.formContent.btn = action.payload.btn;
    },
  },
});

export const {
  setListLevel,
  setVisibles,
  setReloadTable,
  setTotalPage,
  searchQuery,
  setFormContent,
} = Level.actions;
export default Level.reducer;
