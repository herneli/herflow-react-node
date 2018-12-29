import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getDefaultFormState } from "./utils";

const styles = { root: {} };

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static getDerivedStateFromProps(props, state) {
    let { definitions } = props.schema;
    let formData = getDefaultFormState(
      props.schema,
      props.formData,
      definitions
    );
    return {
      formData: formData
    };
  }
  render() {
    return (
      <div>
        <h1>Form</h1>
        {JSON.stringify(this.state.formData)}
      </div>
    );
  }
}

Form.propTypes = {
  schema: PropTypes.object.isRequired,
  formData: PropTypes.any
};

export default withStyles(styles)(Form);
