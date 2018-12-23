import React, { Component } from "react";
import PropTypes from "prop-types";
import TextEditor from "./editors/TextEditor";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconOperator from "mdi-material-ui/FunctionVariant";
import { validate } from "jsonschema";
export default class OperatorEditor extends Component {
  constructor(props) {
    super(props);
    let params = this.props.path && this.props.path.params;
    this.state = { params: params || {} };
  }
  handleChange = (name, value) => {
    this.setState({
      ...this.state,
      params: { ...this.state.params, [name]: value }
    });
  };
  handleAdd = () => {
    let schema = this.getParamSchema();
    let validationResult = null;
    if (schema) {
      validationResult = validate(this.state.params, schema);
    } else {
      validationResult = { valid: true };
    }
    if (validationResult.valid) {
      this.props.onOperatorAdded &&
        this.props.onOperatorAdded({
          op: this.props.path.op,
          params: this.state.params
        });
    } else {
      console.log(validationResult);
      this.setState({ ...this.state, error: validationResult });
    }
  };

  getParamSchema = () => {
    let operator = this.props.operators[this.props.path.op];
    return operator && operator.paramSchema;
  };
  render() {
    let schema = this.getParamSchema();
    let operatorParamEditors = null;
    let errors = {};
    if (this.state.error) {
      this.state.error.errors.forEach(error => {
        if (error.property === "instance") {
          if ((error.name = "required")) {
            errors[error.argument] = error.name;
          }
        } else {
          let property = error.property.replace("instance.", "");
          if (property) {
            errors[property] = error.message;
          }
        }
      });
    }
    if (schema && schema.properties) {
      operatorParamEditors = Object.keys(schema.properties).map(paramKey => {
        return (
          <div key={paramKey}>
            <TextEditor
              name={paramKey}
              schema={schema.properties[paramKey]}
              value={this.state.params[paramKey] || ""}
              onChange={this.handleChange}
              error={!!errors[paramKey]}
              helperText={errors[paramKey]}
            />
          </div>
        );
      });
    }
    return (
      <Dialog onClose={this.handleClose} open={true} fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          <IconOperator /> {this.props.path.op}
        </DialogTitle>
        <DialogContent>
          {this.state.error ? <span>Please check errors</span> : null}
          {operatorParamEditors}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAdd} color="primary">
            Add operator
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

OperatorEditor.propTypes = {
  path: PropTypes.object,
  operators: PropTypes.object
};
