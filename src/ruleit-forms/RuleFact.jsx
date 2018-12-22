import React, { Component } from "react";
import SchemaPropertiesSelector from "./SchemaPropertiesSelector";
import Button from "@material-ui/core/Button";
import IconDelete from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";

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
class RuleFact extends Component {
  render() {
    let { classes } = this.props;
    return (
      <div className={classes.rule}>
        <SchemaPropertiesSelector schema={this.props.schema} />
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

export default withStyles(styles)(RuleFact);
