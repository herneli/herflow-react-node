import React, { Component } from "react";
import FactSelector from "../ruleit-forms/FactSelector";
import schema from "./schema.json";
import operators from "../ruleit/operators";
import TestRuleEgine from "./TestRuleEgine";
import Button from "@material-ui/core/Button";
import RuleEngine from "../ruleit/RuleEngine";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = { path: ["title"], facts: '{"name": "Jordi"}' };
  }
  handleChange = (name, value) => {
    this.setState({ ...this.state, [name]: value });
  };
  handleValidate = () => {
    let engine = new RuleEngine({ condition: JSON.parse(this.state.options) });
    engine
      .run(JSON.parse(this.state.facts))
      .then(response => {
        this.setState({ ...this.state, validation: JSON.stringify(response) });
      })
      .catch(reason => {
        console.log(reason);
        this.setState({ ...this.state, validation: JSON.stringify(reason) });
      });
  };
  render() {
    return (
      <div style={{ margin: 20 }}>
        <div>
          <div>
            Facts:
            <textarea
              value={this.state.facts}
              onChange={event => this.handleChange("facts", event.target.value)}
            />
          </div>
          <div>
            Options:
            <textarea
              value={this.state.options}
              onChange={event =>
                this.handleChange("options", event.target.value)
              }
            />
          </div>
        </div>
        <FactSelector
          schema={schema}
          path={this.state.path}
          name="User"
          operators={operators}
          onChange={path => this.handleChange("path", path)}
        />
        <div>
          <Button onClick={this.handleValidate}>Validate</Button>
        </div>
        <div>{this.state.validation}</div>
        {/* <TestRuleEgine /> */}
      </div>
    );
  }
}
