import React, { Component } from "react";
import Form from "../ruleit-forms";
import schema from "./schema.json";
import Paper from "@material-ui/core/Paper";

export default class TestForm extends Component {
  render() {
    return (
      <div>
        <Paper style={{ margin: 20, padding: 20 }}>
          <Form
            schema={schema}
            noHtml5Validate={true}
            formData={{ title: "Hello", addresses: [] }}
            onChange={value => {
              console.log(value);
            }}
            language="es"
          />
        </Paper>
      </div>
    );
  }
}
