import { isObject, isString, get, isInteger, isArray } from "lodash";
import defaultOperators from "./operators";
import resolveExpressionOperator from "./resolveExpressionOperator";

const resolveExpression = (context, exp = null, options = {}) => {
  let operators = Object.assign({}, defaultOperators, options.operators);
  // Validate context
  if (!isObject(context)) {
    throw new Error("Context prameter must be an object");
  }

  // If exp variable is a String => converto to array
  if (isString(exp)) {
    exp = [exp];
  }

  // If exp variable is an Array
  if (isArray(exp)) {
    // Set current context from parameter
    let currentContext = context;

    // Traverse each item in exp
    exp.forEach(expItem => {
      // If current item is string, search it with lodash.get
      if (isString(expItem)) {
        currentContext = get(currentContext, expItem);
        // If current expression item is an object, validate it...
      } else if (isObject(expItem)) {
        if (expItem.op && isString(expItem.op)) {
          currentContext = resolveExpressionOperator(
            currentContext,
            expItem,
            operators,
            context
          );
        } else {
          throw new Error("Expression item object has wrong format");
        }
      } else if (isInteger(expItem)) {
        if (expItem >= 0) {
          currentContext = currentContext[expItem];
        } else {
          currentContext = currentContext[currentContext.length + expItem];
        }
      } else {
        throw new Error("Expression type not valid");
      }
    });
    return currentContext;
  } else {
    throw new Error("Wrong expression object type");
  }
};

export default resolveExpression;
