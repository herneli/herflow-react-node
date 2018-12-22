import React, { Component } from "react";
import Expression from "../ruleit-forms/Expression";
import schema from "./schema.json";
export default class Test extends Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <Expression schema={schema} />
      </div>
    );
  }
}
