import React, { Component } from "react";
import getValue from "../ruleit/getValue";

let user = {
  name: "Pedro",
  addresses: [{ city: "Terrassa" }, { city: "Barcelona" }]
};

let path = ["name", { op: "in", params: [["Jordi", "Pedro"], true] }];

export default class TestGetValue extends Component {
  render() {
    let result = getValue(user, path);
    console.log(result);
    let pathJson = JSON.stringify(path);
    console.log("JSON: ", pathJson);
    return <div>Test getValue</div>;
  }
}
