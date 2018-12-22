import React, { Component } from "react";
import refParser from "json-schema-ref-parser";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

let styles = {};
class SchemaPropertiesSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { loadingSchema: true, fact: [], currentProperties: [] };
  }

  componentDidMount = () => {
    if (this.props.schema) {
      refParser.dereference(this.props.schema).then(refSchema => {
        this.setState({ loadingSchema: false, schema: refSchema, prop: "" });
      });
    }
  };
  handleOnChange = event => {
    this.setState({ prop: event.target.value });
  };
  render() {
    if (this.state.loadingSchema) {
      return <span>Loading...</span>;
    } else {
      let properties = [];
      properties.push(
        <MenuItem key="" value="" disabled>
          Property
        </MenuItem>
      );
      Object.keys(this.state.schema.properties).forEach(prop => {
        properties.push(
          <MenuItem key={prop} value={prop}>
            {this.state.schema.properties[prop].title || prop}
          </MenuItem>
        );
      });
      return (
        <span>
          <Select
            value={this.state.prop}
            onChange={this.handleOnChange}
            displayEmpty
            placeholder="Property"
          >
            {properties}
          </Select>
        </span>
      );
    }
  }
}

export default withStyles(styles)(SchemaPropertiesSelector);
