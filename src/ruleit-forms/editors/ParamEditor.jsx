import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { isObject, isArray } from "lodash";
const styles = {
  root: {
    marginTop: 20
  }
};

class ParamEditor extends Component {
  constructor(props) {
    super(props);
    let value;
    if (props.schema.type !== "boolean") {
      value = this.convertValueToString(this.props.value);
    } else {
      value = this.props.value;
    }
    this.state = {
      value: value,
      error: this.props.error,
      errorMessage: this.props.errorMessage
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.error !== this.state.error ||
      prevProps.errorMessage !== this.state.errorMessage
    ) {
      this.setState({
        ...this.state,
        error: prevProps.error,
        errorMessage: prevProps.errorMessage
      });
    }
  };

  convertValueToString = value => {
    let stringValue;
    switch (this.props.schema.type) {
      case "number":
        value = value.toString();
        break;
      case "object":
      case "array":
        if (!value) {
          stringValue = "";
        } else {
          stringValue = JSON.stringify(value, null, 2);
        }
        break;
      default:
        stringValue = value;
    }
    return stringValue;
  };

  convertStringToValue = stringValue => {
    let value;
    switch (this.props.schema.type) {
      case "number":
      case "integer":
        value = Number(stringValue);
        if (!isNaN(value)) {
          return value;
        } else {
          throw new Error("Value is not a number");
        }
      case "object":
        value = JSON.parse(stringValue);
        if (isObject(value)) {
          return value;
        } else {
          throw new Error("Value is not an object");
        }
      case "array":
        value = JSON.parse(stringValue);
        if (isArray(value)) {
          return value;
        } else {
          throw new Error("Value is not an array");
        }
      default:
        value = stringValue;
    }
    return stringValue;
  };

  handleOnChange = event => {
    let value;
    try {
      let cleanValue;
      if (this.props.schema.type !== "boolean") {
        value = event.target.value;
        cleanValue = this.convertStringToValue(value);
      } else {
        value = event.target.checked;
        cleanValue = value;
      }
      this.props.onChange && this.props.onChange(this.props.name, cleanValue);
      this.setState({
        ...this.state,
        value: value,
        error: false,
        errorMessage: null
      });
    } catch (error) {
      this.setState({
        ...this.state,
        value: value,
        error: true,
        errorMessage: error.message
      });
    }
  };

  render() {
    let { name, schema, classes } = this.props;

    let type = "text";
    let multiline = false;
    let editor = "text";

    switch (schema.type) {
      case "string":
        switch (schema.format) {
          case "date":
            type = "date";
            break;
          case "email":
            type = "email";
            break;
          case "password":
            type = "password";
            break;
          default:
            type = "text";
        }
        break;
      case "number":
      case "integer":
        type = "number";
        break;
      case "array" || "object":
        type = "text";
        multiline = true;
        break;
      case "boolean":
        editor = "boolean";
      default:
        type = "text";
        multiline = true;
    }
    if (editor === "text") {
      return (
        <TextField
          className={classes.root}
          multiline={multiline}
          fullWidth
          type={type}
          placeholder={name}
          label={name}
          value={this.state.value}
          error={this.state.error}
          helperText={this.state.errorMessage}
          InputProps={this.props.InputProps}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
        />
      );
    } else {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.value}
              onChange={this.handleOnChange}
              value={this.state.value}
              color="primary"
            />
          }
          label={this.props.name}
        />
      );
    }
  }
}

export default withStyles(styles)(ParamEditor);
