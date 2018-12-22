import client from "../services/httpClient";
import { setTokens, refreshToken, resumeToken } from "../services/tokens";
import manageErrors from "../services/manageErrors";
import { createAction, handleActions } from "redux-actions";
import T from "i18n-react";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  tryAutoLogin: true,
  user: null,
  language: "es"
};

export const LOGOUT = "session/LOGOUT";

export const SET_USER_AUTHENTICATED = "session/SET_USER_AUTHENTICATED";
export const SET_USER_SETTINGS = "session/SET_USER_SETTINGS";
export const SET_USER_SETTINGS_LANGUAGE = "session/SET_USER_SETTINGS_LANGUAGE";
export const CANCEL_AUTO_LOGIN = "session/CANCEL_AUTO_LOGIN";
export const TOGGLE_LANGUAGE = "session/TOGGLE_LANGUAGE";

// Action definitions
export const setUserSettings = createAction(
  SET_USER_SETTINGS,
  userSettings => userSettings
);
export const logout = createAction(LOGOUT);
export const setUserAuthenticated = createAction(SET_USER_AUTHENTICATED);
export const cancelAutoLogin = createAction(CANCEL_AUTO_LOGIN);
export const toggleLanguage = createAction(TOGGLE_LANGUAGE);

// Reducer
export default handleActions(
  {
    [SET_USER_SETTINGS]: (state, action) => {
      let newState = {
        ...state,
        user: action.payload,
        language: action.payload.language || "es",
        loading: false,
        isAuthenticated: true,
        isInitialized: true
      };
      return newState;
    },
    [SET_USER_AUTHENTICATED]: (state, action) => {
      let newState = {
        ...state,
        isAuthenticated: true
      };
      return newState;
    },
    [LOGOUT]: (state, action) => {
      return { ...initialState, tryAutoLogin: false };
    },
    [CANCEL_AUTO_LOGIN]: (state, action) => {
      return { ...state, tryAutoLogin: false };
    },
    [TOGGLE_LANGUAGE]: (state, action) => {
      return { ...state, language: state.language === "es" ? "en" : "es" };
    }
  },
  initialState
);

export const getUserSettings = () => dispatch => {
  refreshToken()
    .then(() => {
      client
        .get("/users/current/settings")
        .then(response => {
          if (response.data.language) {
            T.setTexts(
              require("i18n/texts-" + response.data.language + ".json")
            );
          }
          dispatch(setUserSettings(response.data));
        })
        .catch(exc => {
          dispatch(logout());
          manageErrors(exc);
        });
    })
    .catch(exc => {
      manageErrors(exc);
      dispatch(logout());
    });
};

export const authenticate = tokens => dispatch => {
  setTokens(tokens.accessToken, tokens.refreshToken);
  dispatch(setUserAuthenticated());
};

export const resumeAuthentication = () => dispatch => {
  if (resumeToken()) {
    dispatch(setUserAuthenticated());
  }
};
