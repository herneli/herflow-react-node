import React, { Component } from "react";

export default class FactPart extends Component {
  render() {
    let name = this.props.pathToken.name;
    return <span>{name}</span>;
  }
}
