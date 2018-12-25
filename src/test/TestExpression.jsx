import React, { Component } from "react";
import Expression from "../ruleit-forms/Expression";
import schema from "./schema.json";
import operators from "../ruleit/operators";
export default class TestExpression extends Component {
  constructor(props) {
    super(props);
    this.state = { rule: { type: "group", combinator: "all", rules: [] } };
  }
  render() {
    return (
      <div>
        <Expression
          schema={schema}
          rule={this.state.rule}
          contextName="User"
          operators={operators}
        />
      </div>
    );
  }
}
