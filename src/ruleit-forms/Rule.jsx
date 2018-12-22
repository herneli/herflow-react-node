import React, { Component } from "react";
import RuleFact from "./RuleFact";
import RuleGroup from "./RuleGroup";

export default class Rule extends Component {
  render() {
    let { rule } = this.props;
    if (rule.type === "group") {
      return <RuleGroup {...this.props} />;
    } else if (rule.type === "fact") {
      return <RuleFact {...this.props} />;
    } else {
      return <h1>Incorrect rule</h1>;
    }
  }
}
