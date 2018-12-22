import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import session from "./session";
import workflow from "./workflow";

export default combineReducers({
  router: routerReducer,
  // auth,
  session,
  workflow
});
