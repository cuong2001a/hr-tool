import Cookies from 'js-cookie';

export function getToken(TokenKey = 'Auth-Token') {
  return Cookies.get(TokenKey);
}

export function setToken(token, TokenKey = 'Auth-Token') {
  return Cookies.set(TokenKey, token);
}

export function removeToken(TokenKey = 'Auth-Token') {
  return Cookies.remove(TokenKey);
}

export function clearCookie() {
  return Object.keys(Cookies.get()).forEach(tokenName =>
    Cookies.remove(tokenName),
  );
}

export function setIsLogin(token, TokenKey = 'Login') {
  return Cookies.set(TokenKey, token);
}
export function getIsLogin(TokenKey = 'Login') {
  return Cookies.get(TokenKey);
}

export function setCookieRefreshToken(token, TokenKey = 'Refresh-Token') {
  return Cookies.set(TokenKey, token);
}

export function getRefreshToken(TokenKey = 'Refresh-Token') {
  return Cookies.get(TokenKey);
}
