import React, { Component } from "react";
import PropTypes from "prop-types";
import ParamEditor from "./ParamEditor";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconOperator from "mdi-material-ui/FunctionVariant";
import InputAdornment from "@material-ui/core/InputAdornment";
import { validate } from "jsonschema";
import { withStyles } from "@material-ui/core";
import getSchemaIcon from "../getSchemaIcon";
import { isFunction } from "lodash";
const styles = theme => ({
  iconType: {
    color: theme.palette.primary.light
  }
});

class OperatorEditor extends Component {
  constructor(props) {
    super(props);
    let params = this.props.exp && this.props.exp.params;
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
          op: this.props.exp.op,
          params: this.state.params
        });
    } else {
      this.setState({ ...this.state, error: validationResult });
    }
  };

  getParamSchema = () => {
    let operator = this.props.operators[this.props.exp.op];
    if (operator.paramSchema) {
      if (isFunction(operator.paramSchema)) {
        return operator.paramSchema(this.props.thisSchema);
      } else {
        return operator.paramSchema;
      }
    } else {
      return null;
    }
  };
  render() {
    let schema = this.getParamSchema();
    let operatorParamEditors = [];
    let { classes } = this.props;
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
      Object.keys(schema.properties).forEach(paramKey => {
        if (paramKey === "$this") {
          return;
        }
        let typeIcon = getSchemaIcon(schema.properties[paramKey], {
          className: classes.iconType
        });
        operatorParamEditors.push(
          <div key={paramKey}>
            <ParamEditor
              name={paramKey}
              schema={schema.properties[paramKey]}
              value={this.state.params[paramKey] || ""}
              onChange={this.handleChange}
              error={!!errors[paramKey]}
              errorMessage={errors[paramKey]}
              InputProps={{
                startAdornment: typeIcon ? (
                  <InputAdornment position="start">{typeIcon}</InputAdornment>
                ) : null
              }}
            />
          </div>
        );
      });
    }
    return (
      <Dialog onClose={this.handleClose} open={true} fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          <IconOperator /> {this.props.exp.op}
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
  exp: PropTypes.object,
  operators: PropTypes.object
};

export default withStyles(styles)(OperatorEditor);
