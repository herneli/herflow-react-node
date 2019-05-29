import React, { Component } from "react";
import Engine from "../ruleit/RuleEngine";

const user = {
  firstName: "Jordi",
  lastName: "Hernandez",
  addresses: [
    {
      city: "Terrassa"
    },
    {
      city: "Barcelona"
    }
  ]
};

const options = {
  condition: {
    type: "group",
    combinator: "all",
    rules: [
      {
        type: "exp",
        exp: ["firstName", { op: "eq", params: { value: "Jordi" } }]
      },
      {
        type: "exp",
        exp: ["lastName", { op: "eq", params: { value: "Hernandez" } }]
      }
    ]
  }
};

export default class TestRuleEgine extends Component {
  constructor(props) {
    super(props);
    this.state = { responseType: null, response: null };
  }
  componentDidMount = () => {
    let engine = new Engine(options);
    engine
      .run(user)
      .then(response => {
        this.setState({ responseType: "Ok", response: response });
      })
      .catch(reason => {
        this.setState({ responseType: "Error", response: reason.message });
      });
  };

  render() {
    return (
      <div>
        <h1>Test rule engine</h1>
        <h2>{this.state.responseType}</h2>
        {JSON.stringify(this.state.response)}
      </div>
    );
  }
}
