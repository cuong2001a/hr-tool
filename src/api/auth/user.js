import Cookies from 'js-cookie';

export function setUser(data, userKey = 'User') {
  return Cookies.set(userKey, data);
}

export function getUser(userKey = 'User') {
  return Cookies.get(userKey);
}
