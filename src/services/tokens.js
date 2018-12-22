import jwtDecode from "jwt-decode";
import moment from "moment";
import qs from "qs";
import T from "i18n-react";
import requestApi from "./api";

export const JWT_ACCESS_TOKEN = "jwtAccessToken";
export const JWT_REFRESH_TOKEN = "jwtRefreshToken";
export const JWT_EXPIRED_TOKEN = "jwtExpiredToken";

export function getAccessToken() {
  return localStorage.getItem(JWT_ACCESS_TOKEN) || null;
}

export function setAccessToken(accessToken) {
  return localStorage.setItem(JWT_ACCESS_TOKEN, accessToken) || null;
}

function getRefreshToken() {
  return localStorage.getItem(JWT_REFRESH_TOKEN) || null;
}

function resetTokens() {
  localStorage.removeItem(JWT_ACCESS_TOKEN);
  localStorage.removeItem(JWT_REFRESH_TOKEN);
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken === null || refreshToken === null) {
    resetTokens();
    return false;
  } else {
    localStorage.setItem(JWT_ACCESS_TOKEN, accessToken);
    localStorage.setItem(JWT_REFRESH_TOKEN, refreshToken);
    return true;
  }
}

function isTokenExpired(accessToken) {
  const tokenDecoded = jwtDecode(accessToken);
  const now = moment.utc();
  const expires = moment.unix(tokenDecoded.exp).utc();
  return expires < now;
}

function OAuthGetAccessToken(email, password) {
  const info = {
    username: email,
    password: password,
    grant_type: "password",
    client_id: process.env.REACT_APP_CLIENT_ID
  };

  // const data = Object.entries(info)
  //   .map(e => e.join('='))
  //   .join('&');

  return requestApi("/oauth2/token", {
    method: "auth",
    data: qs.stringify(info)
  });
}

function OAuthRefreshToken() {
  const info = {
    refresh_token: getRefreshToken(),
    grant_type: "refresh_token",
    client_id: process.env.REACT_APP_CLIENT_ID
  };

  // var data = Object.entries(info)
  //   .map(e => e.join('='))
  //   .join('&');

  return requestApi("/oauth2/token", {
    method: "auth",
    data: qs.stringify(info)
  });
}

export function authenticate(email, password) {
  return OAuthGetAccessToken(email, password)
    .then(response => {
      setTokens(response.data.access_token, response.data.refresh_token);
    })
    .catch(exception => {
      resetTokens();
      throw exception;
    });
}

export function refreshToken() {
  return OAuthRefreshToken()
    .then(response => {
      setTokens(response.data.access_token, response.data.refresh_token);
    })
    .catch(exception => {
      resetTokens();
      throw exception;
    });
}

export function revokeToken() {
  // Por si algun dia se inlcluye una llamada para revokar/borrar el token del servidor
  return Promise.resolve(resetTokens());
}

export function renewToken() {
  return new Promise((resolve, reject) => {
    function buildError(exception) {
      let myError = new Error(401);
      if (exception) {
        myError = {
          ...myError,
          response: {
            isHandledError: true,
            message: T.translate("expired_session")
          },
          statusCode: 401,
          jwtExpired: true
        };
      } else {
        myError = {
          ...myError,
          response: {
            isHandledError: true,
            message: T.translate("expired_session")
          },
          statusCode: 401,
          jwtExpired: true
        };
      }
      return myError;
    }

    const jwt_access = getAccessToken();
    const jwt_refresh = getRefreshToken();

    if (jwt_access == null || jwt_refresh == null) {
      return reject(buildError());
    } else if (isTokenExpired(jwt_access)) {
      refreshToken()
        .then(response => resolve())
        .catch(exception => reject(buildError(exception)));
    } else {
      return resolve();
    }
  });
}

export function resumeToken() {
  const jwt_access = getAccessToken();
  const jwt_refresh = getRefreshToken();

  if (jwt_access == null || jwt_refresh == null) {
    return false;
  } else if (isTokenExpired(jwt_access)) {
    return false;
  } else {
    return true;
  }
}
