import { isArray, isString, isInteger, isObject, isFunction } from "lodash";
import tokenSourceType from "./tokenSourceType";

const getExpressionArray = exp => {
  let expParts = [];
  if (!exp) {
    exp = [];
  }
  if (isString(exp)) {
    let expClean = exp.replace("[", ".");
    expClean = expClean.replace("]", "");
    expClean.split(".").forEach(expItemClean => {
      expParts.push(expItemClean);
    });
  } else if (isArray(exp)) {
    exp.forEach(expItem => {
      if (isString(expItem)) {
        let expClean = expItem.replace("[", ".");
        expClean = expClean.replace("]", "");
        expClean.split(".").forEach(expItemClean => {
          expParts.push(expItemClean);
        });
      } else if (isInteger(expItem)) {
        expParts.push(expItem);
      } else if (isObject(expItem)) {
        if (expItem.op) {
          expParts.push(expItem);
        } else {
          throw new Error("Wrong expression item object");
        }
      } else {
      }
    });
  }
  expParts = expParts.map(item => {
    if (isString(item)) {
      let arrayIndex = Number(item);
      if (isInteger(arrayIndex)) {
        return arrayIndex;
      } else {
        return item;
      }
    } else {
      return item;
    }
  });
  return expParts;
};

const getOperatorOutput = (operator, thisSchema) => {
  if (!operator.output) {
    return thisSchema;
  } else {
    if (isFunction(operator.output)) {
      return operator.output(thisSchema);
    } else {
      return operator.output;
    }
  }
};

const getExpressionTokens = (schema, exp, options = {}) => {
  let operators = options.operators || {};
  try {
    exp = getExpressionArray(exp);
    let expTokens = [];
    let subSchema = schema;

    expTokens.push({
      name: options.rootName || "root",
      exp: null,
      source: tokenSourceType.root,
      schema: subSchema
    });
    exp.forEach(expItem => {
      if (isString(expItem)) {
        let property = subSchema.properties[expItem];
        if (property) {
          subSchema = property;
          expTokens.push({
            name: expItem,
            exp: expItem,
            source: tokenSourceType.property,
            schema: subSchema
          });
        } else {
          throw new Error(`Property ${expItem} not expected`);
        }
      } else if (isInteger(expItem)) {
        if (subSchema.type !== "array") {
          throw new Error(`Expression item "integer" only allowed in arrays`);
        } else {
          subSchema = subSchema.items;
          expTokens.push({
            name: "[" + expItem + "]",
            exp: expItem,
            source: tokenSourceType.index,
            schema: subSchema
          });
        }
      } else if (isObject(expItem) && expItem.op) {
        let operator = operators[expItem.op];
        if (!operator) {
          throw new Error(`Operator "${expItem.op}" not found`);
        }

        // Calculate subschema output
        subSchema = getOperatorOutput(operator, subSchema);
        console.log(subSchema);
        expTokens.push({
          name: expItem.op,
          exp: expItem,
          source: tokenSourceType.operator,
          schema: subSchema
        });
      } else {
        throw new Error("Expression item not allowed");
      }
    });
    return expTokens;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getExpressionTokens;
export { getExpressionArray };
