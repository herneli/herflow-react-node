import React, { Component } from "react";
import PropTypes from "prop-types";
import getPathTokens, { cleanPath } from "../ruleit/getPathTokens";
import refParser from "json-schema-ref-parser";
import FactPart from "./FactPart";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: "10px 0px 12px 5px",
    borderRadius: "5px",
    border: "1px solid",
    borderColor: theme.palette.primary.light,
    display: "inline-block"
  }
});

class FactSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { schema: null };
  }

  componentDidMount = () => {
    let path = cleanPath(this.props.path);
    this.props.onChange && this.props.onChange(path);
    if (this.props.schema) {
      refParser.dereference(this.props.schema).then(refSchema => {
        this.setState({ schema: refSchema });
      });
    }
  };

  handleOnAddPath = path => {
    this.props.onChange && this.props.onChange([...this.props.path, path]);
  };

  render() {
    let { classes } = this.props;
    if (this.state.schema) {
      let pathTokens = getPathTokens(this.state.schema, this.props.path, {
        operators: this.props.operators,
        rootName: this.props.name
      });
      if (pathTokens) {
        let pathComponents = pathTokens.map((pathToken, index) => {
          return (
            <FactPart
              key={index}
              token={pathToken}
              withMenu={index === pathTokens.length - 1}
              onAddPath={this.handleOnAddPath}
              operators={this.props.operators}
            />
          );
        });
        return <div className={classes.root}>{pathComponents}</div>;
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
  operators: PropTypes.object.isRequired,
  name: PropTypes.string,
  path: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func
};

export default withStyles(styles)(FactSelector);
