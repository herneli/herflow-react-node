import React, { Component } from "react";
import FactSelector from "../ruleit-forms/FactSelector";
import schema from "./schema.json";

export default class Test extends Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <FactSelector schema={schema} path={""} name="User" />
      </div>
    );
  }
}
