import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

export default class TextEditor extends Component {
  handleChange = event => {
    if (this.props.onChange) {
      this.props.onChange(this.props.field, event.target.value);
    }
  };

  render() {
    let error = false;
    let errorMessage = null;
    if (this.props.error) {
      error = true;
      errorMessage = this.props.error;
    }
    return (
      <FormControl
        fullWidth
        error={error}
        aria-describedby="component-error-text"
      >
        <InputLabel htmlFor="component-error">{this.props.label}</InputLabel>
        <Input
          id="component-error"
          value={this.props.value}
          onChange={this.handleChange}
        />
        {errorMessage ? (
          <FormHelperText id="component-error-text">
            {errorMessage}
          </FormHelperText>
        ) : null}
      </FormControl>
    );
  }
}
