import React, { Component } from "react";
import operators from "../ruleit/operators";
import schema from "./schema.json";
import refParser from "json-schema-ref-parser";
import FactSelector from "../ruleit-forms/expressions/FactSelector";

let exp = [];

export default class TestFactSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { schema: null, exp: exp };
  }
  componentDidMount = () => {
    refParser.dereference(schema).then(schemaRef => {
      this.setState({ schema: schemaRef });
    });
  };

  handleOnChange = name => value => {
    this.setState({ ...this.state, [name]: value });
  };

  render() {
    if (this.state.schema) {
      return (
        <FactSelector
          schema={this.state.schema}
          exp={this.state.exp}
          operators={operators}
          onChange={this.handleOnChange("exp")}
        />
      );
    } else {
      return <h1>Loading...</h1>;
    }
  }
}
