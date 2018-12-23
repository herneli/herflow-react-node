import { get, isObject } from "lodash";
import getType from "./getType";
import { validate } from "jsonschema";

const validateParams = (fn, params) => {
  if (!fn.paramSchema || !isObject(fn.paramSchema.properties)) {
    return;
  }

  Object.keys(fn.paramSchema.properties).forEach(paramKey => {
    let paramValue = get(params, paramKey, null);
    let schemaValidation = validate(
      paramValue,
      fn.paramSchema.properties[paramKey]
    );
    if (!schemaValidation.valid) {
      throw new Error(`Parameter "${paramKey}" not valid`);
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
