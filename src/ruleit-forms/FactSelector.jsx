import React, { Component } from "react";
import PropTypes from "prop-types";
import getExpressionTokens, {
  getExpressionArray
} from "../ruleit/getExpressionTokens";
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
    let exp = getExpressionArray(this.props.exp);
    this.props.onChange && this.props.onChange(exp);
    if (this.props.schema) {
      refParser.dereference(this.props.schema).then(refSchema => {
        this.setState({ schema: refSchema });
      });
    }
  };

  handleOnAddExp = exp => {
    this.props.onChange && this.props.onChange([...this.props.exp, exp]);
  };

  render() {
    let { classes } = this.props;
    if (this.state.schema) {
      let expTokens = getExpressionTokens(this.state.schema, this.props.exp, {
        operators: this.props.operators,
        rootName: this.props.name
      });
      if (expTokens) {
        let expComponents = expTokens.map((expToken, index) => {
          return (
            <FactPart
              key={index}
              token={expToken}
              withMenu={index === expTokens.length - 1}
              onAddExp={this.handleOnAddExp}
              operators={this.props.operators}
            />
          );
        });
        return <div className={classes.root}>{expComponents}</div>;
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
  exp: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func
};

export default withStyles(styles)(FactSelector);
