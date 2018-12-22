import React, { Component } from "react";
import getSchemaPath from "../ruleit/getSchemaPath";
import operators, { operatorByType } from "../ruleit/operators";
import schema from "./schema.json";
import refParser from "json-schema-ref-parser";

let path = ["addresses", 1, "city", { op: "toLower" }];

export default class TestFactSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { schema: null };
  }
  componentDidMount = () => {
    refParser.dereference(schema).then(schemaRef => {
      this.setState({ schema: schemaRef });
    });
  };

  render() {
    if (this.state.schema) {
      let property = getSchemaPath(schema, path, operators);
      console.log(property);
    }
    return (
      <div>
        <h1>Test path selector</h1>
      </div>
    );
  }
}
