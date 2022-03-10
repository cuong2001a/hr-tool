import { createSlice } from '@reduxjs/toolkit';

export const authentication = createSlice({
  name: 'authentication',
  initialState: {
    isLogin: false,
    userInfor: {},
  },
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = true;
      for (const key in action.payload) {
        state.userInfor[key] = action.payload[key];
      }
    },
  },
});

export const { setLogin } = authentication.actions;

export default authentication.reducer;
