import { createSlice } from '@reduxjs/toolkit';
const initState = {
  searchQuery: '',
  visibleDrawer: false,
  reloadTable: false,
  sorter: '',
  edit: false,
};
const userSlice = createSlice({
  name: 'userSetting',
  initialState: initState,
  reducers: {
    changeSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    changeVisibleDrawer: (state, action) => {
      state.visibleDrawer = action.payload;
    },
    setReloadTable: state => {
      state.reloadTable = !state.reloadTable;
    },
    changeSorter: (state, action) => {
      state.sorter = action.payload;
    },
    changeEdit: (state, action) => {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;
export const {
  changeSearchQuery,
  changeVisibleDrawer,
  setReloadTable,
  changeSorter,
  changeEdit,
} = userSlice.actions;
