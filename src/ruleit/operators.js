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
    paramSchema: {
      type: "object",
      properties: {
        start: { type: "integer" },
        end: { type: "integer" }
      },
      required: ["start", "end"]
    },
    output: "string"
  },
  filter: {
    call: (value, params) => filter(value, { [params.field]: params.value }),
    allowed: ["array"],
    paramSchema: {
      type: "object",
      properties: {
        field: { type: "string" },
        value: {}
      }
    },
    output: "item"
  },
  contains: {
    call: (value, item) => value.includes(item),
    allowed: ["array"],
    paramSchema: {
      type: "object",
      properties: {
        item: {}
      }
    },
    output: "boolean"
  },
  doesNotContains: {
    call: (value, item) => !value.includes(item),
    allowed: ["array"],
    paramSchema: {
      type: "object",
      properties: {
        item: {}
      }
    },
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
    paramSchema: {
      type: "object",
      properties: {
        array: { type: "array" }
      }
    },
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
    paramSchema: {
      type: "object",
      properties: {
        array: { type: "array" }
      }
    },
    output: "boolean"
  },
  eq: {
    call: (value, params) => value === params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  ne: {
    call: (value, params) => value !== params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  le: {
    call: (value, params) => value <= params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  lt: {
    call: (value, params) => value < params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  ge: {
    call: (value, params) => value >= params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  gt: {
    call: (value, params) => value > params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  log: {
    call: (value, params) => {
      return true;
    },
    output: "boolean"
  }
};

const filterOperatorsByType = (operators, type) => {
  let filteredOperators = {};
  Object.keys(operators).forEach(operatorKey => {
    let operator = operators[operatorKey];
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
export { filterOperatorsByType };
export default operators;
