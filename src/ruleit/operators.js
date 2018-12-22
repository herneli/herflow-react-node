import { isArray, filter } from "lodash";

const operators = {
  toLower: {
    call: value => String(value).toLowerCase(),
    allowed: ["string"]
  },
  toUpper: {
    call: value => String(value).toUpperCase(),
    allowed: ["string"]
  },
  substring: {
    call: (value, params) => {
      return String(value).substring(params.start, params.end);
    },
    allowed: ["string"],
    params: {
      start: { allowed: ["number"] },
      end: { allowed: ["number"] }
    }
  },
  filter: {
    call: (value, predicate) => filter(value, predicate),
    allowed: ["array"]
  },
  contains: {
    call: (value, item) => value.includes(item),
    allowed: ["array"]
  },
  doesNotContains: {
    call: (value, item) => !value.includes(item),
    allowed: ["array"]
  },
  in: {
    call: (value, array) => {
      if (isArray(array)) {
        return array.includes(value);
      } else {
        throw new Error("In parameter must be an array");
      }
    }
  },
  notIn: {
    call: (value, array) => {
      if (isArray(array)) {
        return !array.includes(value);
      } else {
        throw new Error("In parameter must be an array");
      }
    }
  },
  eq: {
    call: (value, params) => value === params.value
  },
  ne: {
    call: (value, params) => value !== params.value
  },
  le: {
    call: (value, params) => value <= params.value
  },
  lt: {
    call: (value, params) => value < params.value
  },
  ge: {
    call: (value, params) => value >= params.value
  },
  gt: {
    call: (value, params) => value > params.value
  },
  log: {
    call: (value, params) => console.log(params.name || "<anonymous>", value)
  }
};

export default operators;
