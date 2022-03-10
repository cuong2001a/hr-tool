import { createSlice } from '@reduxjs/toolkit';

const requestSlice = createSlice({
  name: 'request',
  initialState: {
    visibleRequestForm: false,
    totalRecords: 0,
    isReloadTable: false,
    requestFormInfo: {},
    listPosition: [],
    listLevel: [],
    listTypeWork: [],
    listLanguages: [],
    listRequestor: [],
  },
  reducers: {
    changeVisibleRequestForm(state, action) {
      state.visibleRequestForm = action.payload;
    },
    setReloadTable(state) {
      state.isReloadTable = !state.isReloadTable;
    },
    setListPosition(state, action) {
      state.listPosition = action.payload;
    },
    setListLevel(state, action) {
      state.listLevel = action.payload;
    },
    setListTypeWork(state, action) {
      state.listTypeWork = action.payload;
    },
    setListLanguages(state, action) {
      state.listLanguages = action.payload;
    },
    setTotalRecords(state, action) {
      state.totalRecords = action.payload;
    },
    setListRequestor(state, action) {
      state.listRequestor = action.payload;
    },
    setRequestFormInfo(state, action) {
      state.requestFormInfo = action.payload;
    },
  },
});
const { reducer, actions } = requestSlice;

export const {
  changeVisibleRequestForm,
  setReloadTable,
  setListPosition,
  setListLevel,
  setListTypeWork,
  setListLanguages,
  setTotalRecords,
  setListRequestor,
  setRequestFormInfo,
} = actions;
export default reducer;
