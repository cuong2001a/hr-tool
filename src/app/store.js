import { configureStore } from '@reduxjs/toolkit';
import filterLangReducer from '../pages/Settings/Language/languageSlice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from '../pages/Settings/commonSlice/userSlice';
import authentication from '../pages/Auth/reducer/auth';
import Level from '../pages/Settings/Level/reducer/Level';
import dataTable from './dashboard-reducer';
import PositionSlide from '../pages/Settings/Position/reducer';
import sourceReducer from '../pages/Settings/Source/sourceSlice';
import dataDetailPlan from '../pages/Plan/reducer/plan-reducer';
import requestReducer from '../pages/Request/requestSlice';
import hrReviewSlide from '../pages/CvManagerment/reducer/hrReview';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['userInfor'],
};

const persistedReducer = persistReducer(persistConfig, authentication);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    level: Level,
    tableDashboard: dataTable,
    user: userSlice,
    position: PositionSlide,
    source: sourceReducer,
    filterLang: filterLangReducer,
    position: PositionSlide,
    detailParams: dataDetailPlan,
    request: requestReducer,
    hrReview: hrReviewSlide,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export default store;
