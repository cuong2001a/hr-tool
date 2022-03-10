import axios from 'axios';
import queryString from 'query-string';
import { getRefreshToken, getToken } from './Cookie';

const refreshToken = getRefreshToken('RefreshToken');
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params =>
    queryString.stringify(params, { skipNull: true, skipEmptyString: true }),
});

// Interceptors
axiosClient.interceptors.request.use(function (config) {
  config.headers = {
    'Content-Type': 'application/json',
    Authorization: getToken('Auth-Token')
      ? `Bearer ${getToken('Auth-Token')}`
      : undefined,
  };
  return config;
});

axiosClient.interceptors.response.use(
  function (response) {
    // if (response.status === 401) {
    //   handleGetRefreshToken(refreshToken);
    // }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosClient;
