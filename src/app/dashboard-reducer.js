import { createSlice } from '@reduxjs/toolkit';

const dataTable = createSlice({
  name: 'dashboard',
  initialState: {
    listData: [],
    listFieldFilter: [],
    listDataSummary: {},
    listDataDepartment: [],
  },
  reducers: {
    setListData: (state, action) => {
      state.listData = action.payload;
    },
    setListFieldFilter: (state, action) => {
      state.listFieldFilter = action.payload;
    },

    setListDataSummary: (state, action) => {
      state.listDataSummary = action.payload;
    },
    setListDataDepartment: (state, action) => {
      state.listDataDepartment = action.payload;
    },
  },
});
const { reducer, actions } = dataTable;
export const {
  setListData,
  setListFieldFilter,
  setListDataSummary,
  setListDataDepartment,
} = actions;
export default reducer;
