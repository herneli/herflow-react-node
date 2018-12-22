import { createAction, handleActions } from "redux-actions";
import client from "../services/httpClient";
import manageErrors from "../services/manageErrors";

// Action constants
export const SET_CURRENT_WORKFLOW = "SET_CURRENT_WORKFLOW";
export const SET_ACTIVITY_CLIPBOARD = "SET_ACTIVITY_CLIPBOARD";

// Pure action definitions
export const setCurrentWorkflow = createAction(
  SET_CURRENT_WORKFLOW,
  workflow => workflow
);
export const setActivityClipboard = createAction(
  SET_ACTIVITY_CLIPBOARD,
  activity => activity
);

const initialState = {
  activeWorkflow: null
};

export const loadWorkflow = workflowId => dispatch => {
  client
    .get("/workflows/" + workflowId)
    .then(response => {
      dispatch(setCurrentWorkflow(response.data));
    })
    .catch(reason => {
      manageErrors(reason);
    });
};

export const saveWorkflow = workflow => dispatch => {
  client
    .post("/workflows", { data: workflow })
    .then(response => {
      setCurrentWorkflow(response.data);
    })
    .catch(reason => {
      manageErrors(reason);
    });
};

export default handleActions(
  {
    [SET_CURRENT_WORKFLOW]: (state, action) => {
      return Object.assign({}, state, { activeWorkflow: action.payload });
    },
    [SET_ACTIVITY_CLIPBOARD]: (state, action) => {
      return Object.assign({}, state, { activityClipboard: action.payload });
    }
  },
  initialState
);
