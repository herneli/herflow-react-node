import { isObject, isArray, isBoolean } from "lodash";
import resolveExpression from "./resolveExpression";
import defaultOperators from "./operators";
const defaultOptions = {};

export default class RuleEngine {
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
    this.operators = Object.assign({}, defaultOperators, options.operators);
  }

  /**
   * Run engine to evaluate conditions
   */
  run(context) {
    return this.checkCondition(context, this.options.condition);
  }

  /**
   * Check condition
   */
  checkCondition(context, condition) {
    return new Promise((resolve, reject) => {
      if (!isObject(condition)) {
        reject(new Error(`Options: "condition" must be an object`));
      }
      // Condition all must be an array
      if (condition.all) {
        if (!isArray(condition.all)) {
          reject(
            new Error(`Options: "condition.any" must be an array of conditions`)
          );
        }

        let conditionPromises = condition.all.map(conditionItem => {
          let promise = this.checkCondition(context, conditionItem);
          return promise;
        });
        Promise.all(conditionPromises)
          .then(values => {
            if (values.includes(false)) {
              resolve(false);
            } else {
              resolve(true);
            }
          })
          .catch(reason => reject(reason));

        // Condition any must be an array
      } else if (condition.any) {
        if (!isArray(condition.any)) {
          reject(
            new Error(`Options: "condition.any" must be an array of conditions`)
          );
        }
        let conditionPromises = condition.any.map(conditionItem => {
          return this.checkCondition(context, conditionItem);
        });
        Promise.all(conditionPromises)
          .then(values => {
            if (values.includes(true)) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(reason => reject(reason));

        // Condition is a "fact" rule
      } else if (condition.$exp) {
        // Condition type not valid
        let expValue = resolveExpression(
          context,
          condition.$exp,
          this.operators
        );
        if (!isBoolean(expValue)) {
          reject(new Error("Expression must return a boolean."));
        } else {
          resolve(expValue);
        }
      } else {
        reject(new Error("Condition type not valid"));
      }
    });
  }
}
