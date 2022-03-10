import { createSlice } from '@reduxjs/toolkit';
export const PositionSlide = createSlice({
  name: 'position',
  initialState: {
    dataPosition: [],
    department: [],
    manager: [],
    requestor: [],
    visibleFormPosition: false,
    visibleFormDepartment: false,
    reloadTable: false,
    detailData: {},
    totalPosition: 0,
    totalPositionDefault: 0,
  },
  reducers: {
    getAllPosition: (state, action) => {
      state.dataPosition = action.payload;
    },
    showFormPosition: (state, action) => {
      state.visibleFormPosition = action.payload;
    },
    showFormDepartment: (state, action) => {
      state.visibleFormDepartment = action.payload;
    },
    setReloadTalbe: (state, action) => {
      state.reloadTable = !state.reloadTable;
    },
    setTotalPosition: (state, action) => {
      state.totalPosition = action.payload;
    },
    setTotalDefault: (state, action) => {
      state.totalPositionDefault = action.payload;
    },
    getDetailPosition: (state, action) => {
      console.log(action.payload);

      state.detailData = action.payload;
    },
    getResultSearch: (state, action) => {
      console.log(action.payload);
      state.dataPosition = action.payload;
    },
    filterDepartment: (state, action) => {
      const dataDepartment = [
        ...new Set(
          action.payload.map(item => {
            return {
              parent_title: item.parent_title,
              parent_id: item.parent_id,
            };
          }),
        ),
      ];
      const data = Array.from(new Set(dataDepartment.map(JSON.stringify))).map(
        JSON.parse,
      );
      const filterNull = data.filter(item => item.parent_title !== null);
      state.department = filterNull;
    },
    filterManager: (state, action) => {
      const dataManager = [
        ...new Set(action.payload.map(item => item.username)),
      ];
      const filterNull = dataManager.filter(item => item !== null);
      state.manager = filterNull;
    },
    filterRequestor: (state, action) => {
      const dataRequestor = [
        ...new Set(action.payload.map(item => item.username)),
      ];
      const filterNull = dataRequestor.filter(item => item !== null);
      state.manager = filterNull;

      state.requestor = filterNull;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getAllPosition,
  showFormPosition,
  showFormDepartment,
  filterDepartment,
  filterManager,
  filterRequestor,
  setReloadTalbe,
  getResultSearch,
  getDetailPosition,
  setTotalPosition,
  setTotalDefault,
} = PositionSlide.actions;

export default PositionSlide.reducer;
