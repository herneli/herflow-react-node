import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  group: {
    border: "1px solid " + theme.palette.grey[300],
    padding: 20,
    marginTop: 20
  },
  groupRoot: {
    padding: 20
  }
});
class FieldGroup extends Component {
  static defaultProps = {
    root: false
  };
  render() {
    let { classes, root } = this.props;
    return (
      <div className={root ? classes.groupRoot : classes.group}>
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(styles)(FieldGroup);
