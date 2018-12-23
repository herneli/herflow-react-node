import React, { Component } from "react";
import PropTypes from "prop-types";
import getPathTokens, { cleanPath } from "../ruleit/getPathTokens";
import refParser from "json-schema-ref-parser";
import operators from "../ruleit/operators";
import FactPart from "./FactPart";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: "10px 0px 12px 5px",
    borderRadius: "5px",
    border: "1px solid",
    borderColor: theme.palette.primary.light
  }
});

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

  handleOnAddPath = path => {
    this.setState({ ...this.setState, path: [...this.state.path, path] });
  };

  render() {
    let { classes } = this.props;
    if (this.state.schema) {
      let pathTokens = getPathTokens(this.state.schema, this.state.path, {
        operators,
        rootName: this.props.name
      });
      console.log(pathTokens);
      if (pathTokens) {
        let pathComponents = pathTokens.map((pathToken, index) => {
          console.log("Path Token", index === pathTokens.length - 1);
          return (
            <FactPart
              key={index}
              token={pathToken}
              withMenu={index === pathTokens.length - 1}
              onAddPath={this.handleOnAddPath}
            />
          );
        });
        return <span className={classes.root}>{pathComponents}</span>;
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

export default withStyles(styles)(FactSelector);
