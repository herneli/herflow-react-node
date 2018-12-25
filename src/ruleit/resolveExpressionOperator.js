import { get, isObject, isFunction } from "lodash";
import { validate } from "jsonschema";
import resolveExpression from "./resolveExpression";
import getType from "./getType";

const validateParams = (fn, params) => {
  let paramSchema = null;
  if (fn.paramSchema) {
    //TODO: Parameter passed to paramSchema function should be the current context schema
    //Empty object is not validating
    if (isFunction(fn.paramSchema)) {
      paramSchema = fn.paramSchema({});
    } else {
      paramSchema = fn.paramSchema;
    }
  }
  if (!paramSchema || !isObject(paramSchema.properties)) {
    return;
  }

  Object.keys(paramSchema.properties).forEach(paramKey => {
    let paramValue = get(params, paramKey, null);
    let schemaValidation = validate(
      paramValue,
      paramSchema.properties[paramKey]
    );
    if (!schemaValidation.valid) {
      throw new Error(`Parameter "${paramKey}" not valid`);
    }
  });
};

const resolveExpressionOperator = (
  context,
  expression,
  operators,
  mainContext = null
) => {
  let operator = operators[expression.op];
  if (operator) {
    let allowed = operator.allowed || [];
    if (allowed.length > 0) {
      let currentContextType = getType(context);
      if (!allowed.includes(currentContextType)) {
        throw new Error(
          `Operator "${
            expression.op
          }" not allowed with object type "${currentContextType}"`
        );
      }
    }
    // Resolve params
    let params = expression.params || {};
    if (!isObject(params)) {
      throw new Error(`Expression: "params" property must be an object`);
    }

    params.$this = context;

    if (expression.value) {
      params.value = expression.value;
    }

    // Resolve parameters with expressions
    let paramsResolved = {};
    Object.keys(params).forEach(paramKey => {
      let param = params[paramKey];
      if (isObject(param) && param.$exp) {
        paramsResolved[paramKey] = resolveExpression(mainContext, param.$exp, {
          operators: operators
        });
      } else {
        paramsResolved[paramKey] = params[paramKey];
      }
    });

    // Validate parameters
    validateParams(operator, paramsResolved);
    return operator.call(paramsResolved);
  } else {
    throw new Error(
      `Operator "${expression.op}" passed in expreesion is not allowed`
    );
  }
};

export default resolveExpressionOperator;
