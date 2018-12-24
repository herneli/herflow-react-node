import { isArray, filter } from "lodash";

const operators = {
  toLower: {
    call: params => String(params.$this).toLowerCase(),
    output: "string",
    paramSchema: {
      type: "object",
      properties: {
        $this: { type: "string" }
      }
    },
    allowed: ["string"]
  },
  toUpper: {
    call: params => String(params.$this).toUpperCase(),
    allowed: ["string"],
    output: "string"
  },
  substring: {
    call: params => {
      return String(params.$this).substring(params.start, params.end);
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
    call: params => filter(params.$this, { [params.field]: params.value }),
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
    call: params => params.$this.includes(params.item),
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
    call: params => !params.$this.includes(params.item),
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
    call: params => {
      return params.array.includes(params.$this);
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
    call: params => {
      return !params.array.includes(params.$this);
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
    call: params => params.$this === params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  ne: {
    call: params => params.$this !== params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  le: {
    call: params => params.$this <= params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  lt: {
    call: params => params.$this < params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  ge: {
    call: params => params.$this >= params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  gt: {
    call: params => params.$this > params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: "boolean"
  },
  sum: {
    call: params => params.value1 + params.value2,
    output: "number"
  },
  log: {
    call: params => {
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
