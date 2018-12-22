import React, { Component } from "react";
import PropTypes from "prop-types";
import getPathTokens, { cleanPath } from "../ruleit/getPathTokens";
import refParser from "json-schema-ref-parser";
import operators from "../ruleit/operators";
import FactPart from "./FactPart";

class FactSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { schema: null };
  }
  componentDidMount = () => {
    if (this.props.schema) {
      refParser.dereference(this.props.schema).then(refSchema => {
        this.setState({ schema: refSchema, path: cleanPath(this.props.path) });
      });
    }
  };

  render() {
    if (this.state.schema) {
      let pathTokens = getPathTokens(this.state.schema, this.state.path, {
        operators,
        rootName: this.props.name
      });
      console.log(pathTokens);
      if (pathTokens) {
        let pathComponents = pathTokens.map((pathToken, index) => {
          return <FactPart key={index} pathToken={pathToken} />;
        });
        return (
          <div>
            <h1>Fact selector</h1>
            {pathComponents}
          </div>
        );
      } else {
        return <h1>Error reading tokens</h1>;
      }
    } else {
      return <h1>Loading...</h1>;
    }
  }
}

FactSelector.propTypes = {
  schema: PropTypes.object.isRequired,
  name: PropTypes.string,
  path: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func
};

export default FactSelector;
