import { get } from "lodash";
import getType from "./getType";

const validateParams = (fn, params) => {
  if (!fn.params) {
    return;
  }

  Object.keys(fn.params).forEach(paramKey => {
    let paramValue = get(params, paramKey, null);
    let paramValueType = getType(paramValue);
    let fnParam = fn.params[paramKey];
    if (fnParam.required && !paramValue) {
      throw new Error(`Parameter ${paramKey} is required`);
    }
    let allowed = fnParam.allowed || [];
    if (allowed.length > 0 && !allowed.includes(paramValueType)) {
      throw new Error(
        `Parameter "${paramKey}" of type "${paramValueType}" not expected. Allowed (${allowed.join(
          ","
        )})`
      );
    }
  });
};
const getValueOperator = (context, path, operators) => {
  let fn = operators[path.op];
  if (fn) {
    let allowed = fn.allowed || [];
    if (allowed.length > 0) {
      let currentContextType = getType(context);
      if (!allowed.includes(currentContextType)) {
        throw new Error(
          `Operator "${
            path.op
          }" not allowed with object type "${currentContextType}"`
        );
      }
    }
    // If pathItem function is passed with options, pass them thorug the function call
    validateParams(fn, path.params);
    if (path.params) {
      return fn.call(context, path.params);
      // Simply call the function
    } else {
      return fn.call(context);
    }
  } else {
    throw new Error(`Function "${path.op}" passed in path is not allowed`);
  }
};

export default getValueOperator;
