import React, { Component } from "react";
import FactSelector from "../ruleit-forms/FactSelector";
import schema from "./schema.json";

export default class Test extends Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <FactSelector
          schema={schema}
          path={["addresses.1.city", { op: "toLower" }, { op: "substring" }]}
          name="User"
        />
      </div>
    );
  }
}
