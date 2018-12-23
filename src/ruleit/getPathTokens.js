import { isArray, isString, isInteger, isObject } from "lodash";
import tokenSourceType from "./tokenSourceType";

const cleanPath = path => {
  let newPath = [];
  if (!path) {
    path = [];
  }
  if (isString(path)) {
    let pathClean = path.replace("[", ".");
    pathClean = pathClean.replace("]", "");
    pathClean.split(".").forEach(pathItemClean => {
      newPath.push(pathItemClean);
    });
  } else if (isArray(path)) {
    path.forEach(pathItem => {
      if (isString(pathItem)) {
        let pathClean = pathItem.replace("[", ".");
        pathClean = pathClean.replace("]", "");
        pathClean.split(".").forEach(pathItemClean => {
          newPath.push(pathItemClean);
        });
      } else if (isInteger(pathItem)) {
        newPath.push(pathItem);
      } else if (isObject(pathItem)) {
        if (pathItem.op) {
          newPath.push(pathItem);
        } else {
          throw new Error("Wrong path item object");
        }
      } else {
      }
    });
  }
  newPath = newPath.map(item => {
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
  return newPath;
};

const getSchemaPath = (schema, path, options = {}) => {
  let operators = options.operators || {};
  try {
    path = cleanPath(path);
    let pathTokens = [];
    let subSchema = schema;

    pathTokens.push({
      name: options.rootName || "root",
      path: null,
      source: tokenSourceType.root,
      schema: subSchema
    });
    path.forEach(pathItem => {
      if (isString(pathItem)) {
        let property = subSchema.properties[pathItem];
        if (property) {
          subSchema = property;
          pathTokens.push({
            name: pathItem,
            path: pathItem,
            source: tokenSourceType.property,
            schema: subSchema
          });
        } else {
          throw new Error(`Property ${pathItem} not expected`);
        }
      } else if (isInteger(pathItem)) {
        if (subSchema.type !== "array") {
          throw new Error(`Path item "integer" only allowed in arrays`);
        } else {
          subSchema = subSchema.items;
          pathTokens.push({
            name: "[" + pathItem + "]",
            path: pathItem,
            source: tokenSourceType.index,
            schema: subSchema
          });
        }
      } else if (isObject(pathItem) && pathItem.op) {
        let operator = operators[pathItem.op];
        if (!operator) {
          throw new Error(`Operator "${pathItem.op}" not found`);
        }
        if (!operator.output) {
          // subSchema = subSchema;
        } else if (operator.output === "item") {
          subSchema = subSchema.items;
        } else if (operator.ouput === "self") {
          // subSchema = subSchema;
        } else {
          subSchema = { type: operator.output };
        }
        pathTokens.push({
          name: pathItem.op,
          path: pathItem,
          source: tokenSourceType.operator,
          schema: subSchema
        });
      } else {
        throw new Error("Path item not allowed");
      }
    });
    return pathTokens;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getSchemaPath;
export { cleanPath };
