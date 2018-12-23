import React, { Component } from "react";
import Engine from "../ruleit/RuleEngine";

const user = {
  name: "Jordi Hernandez",
  createdAt: new Date("2018-02-01"),
  mainCity: "Terrassa",
  addresses: [{ city: "Terrassa" }, { city: "Barcelona" }]
};
const options = {
  condition: {
    all: [
      {
        fact: ["name", { op: "substring", params: { start: "test", end: 3 } }],
        op: "eq",
        params: { value: "Jor" }
      }
    ]
  }
};

export default class TestRuleEgine extends Component {
  constructor(props) {
    super(props);
    this.state = { responseType: null, respnse: null };
  }
  componentDidMount = () => {
    let engine = new Engine(options);
    engine
      .run(user)
      .then(response => {
        this.setState({ responseType: "Ok", response: response });
        console.log(response);
      })
      .catch(reason => {
        this.setState({ responseType: "Error", response: reason });
        console.log(reason);
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
