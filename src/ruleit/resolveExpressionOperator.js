import { get, isObject } from "lodash";
import { validate } from "jsonschema";
import resolveExpression from "./resolveExpression";

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
