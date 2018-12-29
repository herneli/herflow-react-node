import React, { Component } from "react";
import Form from "../ruleit-forms/Form";
import schema from "./schema.json";

export default class TestForm extends Component {
  render() {
    return (
      <div>
        <Form schema={schema} />
      </div>
    );
  }
}
