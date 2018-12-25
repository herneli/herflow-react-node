import { filter } from "lodash";

const operators = {
  toLower: {
    call: params => String(params.$this).toLowerCase(),
    paramSchema: {
      type: "object",
      properties: {
        $this: { type: "string" }
      }
    },
    allowed: ["string"],
    output: { type: "string" }
  },
  toUpper: {
    call: params => String(params.$this).toUpperCase(),
    allowed: ["string"],
    output: { type: "string" }
  },
  substring: {
    call: params => {
      return String(params.$this).substring(params.start, params.end);
    },
    allowed: ["string"],
    paramSchema: {
      type: "object",
      properties: {
        start: { type: "boolean" },
        end: { type: "integer" }
      },
      required: ["start", "end"]
    },
    output: { type: "string" }
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
    output: $this => $this
  },
  item: {
    call: params => params.$this[params.item],
    allowed: ["array"],
    paramSchema: {
      type: "object",
      properties: {
        item: { type: "integer" }
      }
    },
    output: $this => $this.items
  },
  contains: {
    call: params => params.$this.includes(params.item),
    allowed: ["array"],
    paramSchema: $this => ({
      type: "object",
      properties: {
        item: $this.items
      }
    }),
    output: { type: "boolean" }
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
    output: { type: "boolean" }
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
    output: { type: "boolean" }
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
    output: { type: "boolean" }
  },
  eq: {
    call: params => params.$this === params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: { type: "boolean" }
  },
  ne: {
    call: params => params.$this !== params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: { type: "boolean" }
  },
  le: {
    call: params => params.$this <= params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: { type: "boolean" }
  },
  lt: {
    call: params => params.$this < params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: { type: "boolean" }
  },
  ge: {
    call: params => params.$this >= params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: { type: "boolean" }
  },
  gt: {
    call: params => params.$this > params.value,
    paramSchema: {
      type: "object",
      properties: {
        value: {}
      }
    },
    output: { type: "boolean" }
  },
  sum: {
    call: params => params.value1 + params.value2,
    output: "number"
  },
  log: {
    call: params => {
      return true;
    },
    output: { type: "boolean" }
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
