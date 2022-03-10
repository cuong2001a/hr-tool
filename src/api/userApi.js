import axiosClient from './axiosClient';
import { AUTH_URL, REFRESH_URL } from '../constants/auth';

export function postLogin(data) {
  console.log(AUTH_URL, 'URL ');
  return axiosClient.post(AUTH_URL, data);
}

export function postRefeshToken(data) {
  return axiosClient.post(REFRESH_URL, data);
}
