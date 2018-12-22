import { isArray, filter } from "lodash";

const operators = {
  toLower: {
    call: value => String(value).toLowerCase(),
    allowed: ["string"],
    output: "string"
  },
  toUpper: {
    call: value => String(value).toUpperCase(),
    allowed: ["string"],
    output: "string"
  },
  substring: {
    call: (value, params) => {
      return String(value).substring(params.start, params.end);
    },
    allowed: ["string"],
    params: {
      start: { allowed: ["number"] },
      end: { allowed: ["number"] }
    },
    output: "string"
  },
  filter: {
    call: (value, params) => filter(value, { [params.field]: params.value }),
    allowed: ["array"],
    params: {
      field: { allowed: ["string"] },
      value: {}
    },
    output: "item"
  },
  contains: {
    call: (value, item) => value.includes(item),
    allowed: ["array"],
    params: { item: {} },
    output: "boolean"
  },
  doesNotContains: {
    call: (value, item) => !value.includes(item),
    allowed: ["array"],
    params: { item: {} },
    output: "boolean"
  },
  in: {
    call: (value, array) => {
      if (isArray(array)) {
        return array.includes(value);
      } else {
        throw new Error("In parameter must be an array");
      }
    },
    params: { array: {} },
    output: "boolean"
  },
  notIn: {
    call: (value, array) => {
      if (isArray(array)) {
        return !array.includes(value);
      } else {
        throw new Error("In parameter must be an array");
      }
    },
    params: { array: {} },
    output: "boolean"
  },
  eq: {
    call: (value, params) => value === params.value,
    params: { value: {} },
    output: "boolean"
  },
  ne: {
    call: (value, params) => value !== params.value,
    params: { value: {} },
    output: "boolean"
  },
  le: {
    call: (value, params) => value <= params.value,
    params: { value: {} },
    output: "boolean"
  },
  lt: {
    call: (value, params) => value < params.value,
    params: { value: {} },
    output: "boolean"
  },
  ge: {
    call: (value, params) => value >= params.value,
    params: { value: {} },
    output: "boolean"
  },
  gt: {
    call: (value, params) => value > params.value,
    params: { value: {} },
    output: "boolean"
  },
  log: {
    call: (value, params) => {
      return true;
    },
    output: "boolean"
  }
};

const operatorByType = (type, addedOperators = {}) => {
  let filteredOperators = {};
  let selectedOperators = Object.assign({}, operators, addedOperators);
  Object.keys(selectedOperators).forEach(operatorKey => {
    let operator = selectedOperators[operatorKey];
    if (operator.allowed) {
      if (operator.allowed.includes(type)) {
        filteredOperators[operatorKey] = operator;
      }
    } else {
      filteredOperators[operatorKey] = operator;
    }
  });
  return filteredOperators;
};
export { operatorByType };
export default operators;
