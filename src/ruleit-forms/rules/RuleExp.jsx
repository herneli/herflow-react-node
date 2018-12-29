import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconDelete from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import FactSelector from "./FactSelector";

let styles = {
  rule: {
    padding: 10
  },
  addRuleButton: {
    marginLeft: 20
  },
  addGroupButton: {
    marginLeft: 20
  },
  removeGroupButton: {
    marginLeft: 20
  }
};
class RuleExp extends Component {
  handleOnChange = value => {
    this.props.onChange &&
      this.props.onChange({ ...this.props.rule, exp: value });
  };
  render() {
    let { classes } = this.props;
    return (
      <div className={classes.rule}>
        <FactSelector
          schema={this.props.schema}
          exp={this.props.rule.exp}
          operators={this.props.operators}
          name={this.props.contextName}
          onChange={this.handleOnChange}
        />
        {this.props.onDelete ? (
          <Button
            className={classes.removeGroupButton}
            size="small"
            variant="contained"
            color="secondary"
            onClick={this.props.onDelete}
          >
            <IconDelete fontSize="small" />
          </Button>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(RuleExp);
