import React, { Component } from "react";
import TestRuleEngine from "./TestRuleEngine";
import TestResolveExpression from "./TestResolveExpression";
// import TestFactSelector from "./TestFactSelector";
import TestRuleEditor from "./TestRuleEditor";
// import TestForm from "./TestForm";

export default class Test extends Component {
  render() {
    return (
      <React.Fragment>
        <TestResolveExpression />
      </React.Fragment>
    );
  }
}
