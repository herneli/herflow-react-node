import React from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const REQUIRED_FIELD_SYMBOL = "*";

const styles = {
  root: {
    marginBottom: 20
  }
};

function TitleField(props) {
  const { id, title, required, classes } = props;
  return (
    <div id={id} className={classes.root}>
      <Typography variant="h5">
        {title}
        {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
      </Typography>
      <Divider />
    </div>
  );
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool
  };
}

export default withStyles(styles)(TitleField);
