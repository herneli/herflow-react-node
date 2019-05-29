import { filter } from "lodash";

const operators = {
  toLower: {
    call: params => String(params.$this).toLowerCase(),
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
        start: { type: "integer" },
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
        array: { type: "array", items: { type: "string" } }
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
    paramSchema: $this => ({
      type: "object",
      properties: {
        value: $this
      }
    }),
    output: { type: "boolean" }
  },
  ne: {
    call: params => params.$this !== params.value,
    paramSchema: $this => ({
      type: "object",
      properties: {
        value: $this
      }
    }),
    output: { type: "boolean" }
  },
  le: {
    call: params => params.$this <= params.value,
    paramSchema: $this => ({
      type: "object",
      properties: {
        value: $this
      }
    }),
    output: { type: "boolean" }
  },
  lt: {
    call: params => params.$this < params.value,
    paramSchema: $this => ({
      type: "object",
      properties: {
        value: $this
      }
    }),
    output: { type: "boolean" }
  },
  ge: {
    call: params => params.$this >= params.value,
    paramSchema: $this => ({
      type: "object",
      properties: {
        value: $this
      }
    }),
    output: { type: "boolean" }
  },
  gt: {
    call: params => params.$this > params.value,
    paramSchema: $this => ({
      type: "object",
      properties: {
        value: $this
      }
    }),
    output: { type: "boolean" }
  },
  sum: {
    call: params => params.value1 + params.value2,
    paramSchema: $this => ({
      type: "object",
      properties: {
        value1: { type: "number" },
        value2: { type: "number" }
      }
    }),
    output: { type: "number" }
  },
  log: {
    call: params => {
      console.log(params.message);
      return true;
    },
    paramSchema: $this => ({
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }),
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
