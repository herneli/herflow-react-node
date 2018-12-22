import { isObject, isString, get, isInteger, isArray } from "lodash";
import defaultOperators from "./operators";
import getValueOperator from "./getValueOperator";

const getValue = (context, path = null, operators = {}) => {
  operators = Object.assign({}, defaultOperators, operators);
  // Validate context
  if (!isObject(context)) {
    throw new Error("First parameter must be an object");
  }

  // If path variable is a String
  if (isString(path)) {
    return get(context, path);

    // If path variable is an Array
  } else if (isArray(path)) {
    // Set current context from parameter
    let currentContext = context;

    // Traverse each item in path
    path.forEach(pathItem => {
      // If current item is string, search it with lodash.get
      if (isString(pathItem)) {
        currentContext = get(currentContext, pathItem);
        // If current path item is an object, validate it...
      } else if (isObject(pathItem)) {
        if (pathItem.op && isString(pathItem.op)) {
          currentContext = getValueOperator(
            currentContext,
            pathItem,
            operators
          );
        } else {
          throw new Error("Path item object has wrong format");
        }
      } else if (isInteger(pathItem)) {
        if (pathItem >= 0) {
          currentContext = currentContext[pathItem];
        } else {
          currentContext = currentContext[currentContext.length + pathItem];
        }
      } else {
        throw new Error("Path type not valid");
      }
    });
    return currentContext;
  } else {
    throw new Error("Wrong path object type");
  }
};

export default getValue;
