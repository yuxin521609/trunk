export const TokenKey = 'accessToken'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function checkToken(){
  let token = getToken();
  return token != null && token != undefined && token != "";
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}