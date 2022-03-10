import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    visibleFormLang: false,
    listLanguage: [],
    reloadTable: false,
    totalRecords: 0,
  },
  reducers: {
    setVisibleFormLang(state, action) {
      state.visibleFormLang = action.payload;
    },
    setListLanguage(state, action) {
      state.listLanguage = action.payload;
    },
    setReloadTable(state) {
      state.reloadTable = !state.reloadTable;
    },
    setTotalRecords(state, action) {
      state.totalRecords = action.payload;
    },
  },
});
const { reducer, actions } = languageSlice;

export const {
  setVisibleFormLang,
  setListLanguage,
  setReloadTable,
  changeVisibleTableColumn,
  setTotalRecords,
} = actions;
export default reducer;
