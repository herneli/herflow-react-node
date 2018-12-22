import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default class CombinatorSelect extends Component {
  handleOnChange = event => {
    this.props.onChange && this.props.onChange(event.target.value);
  };
  render() {
    return (
      <FormControl>
        <Select
          value={this.props.value}
          onChange={this.handleOnChange}
          displayEmpty
        >
          <MenuItem value={"all"}>All</MenuItem>
          <MenuItem value={"any"}>Any</MenuItem>
        </Select>
      </FormControl>
    );
  }
}
