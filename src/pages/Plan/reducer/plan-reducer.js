import { createSlice } from '@reduxjs/toolkit';

const dataDetailPlan = createSlice({
  name: 'plan',
  initialState: {
    listParams: {},
    listLevel: [],
    listRequest: [],
    listUser: [],
  },
  reducers: {
    setListParams: (state, action) => {
      state.listParams = action.payload;
    },
    setListLevel: (state, action) => {
      state.listLevel = action.payload;
    },
    setListRequest: (state, action) => {
      state.listRequest = action.payload;
    },
    setListUser: (state, action) => {
      state.listUser = action.payload;
    },
  },
});
const { reducer, actions } = dataDetailPlan;
export const { setListParams, setListLevel, setListRequest, setListUser } =
  actions;
export default reducer;
