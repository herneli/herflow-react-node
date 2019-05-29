import React, { Component } from "react";
import isObject from "lodash/isObject";
import SchemaField from "./SchemaField";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FactSelector from "../expressions/FactSelector";

export default class ParamExpressionField extends Component {
  constructor(props) {
    super(props);
    let expSchema = { type: "object", properties: { $exp: {} } };
    let valueSchema = {};
    this.props.schema.oneOf.forEach(itemSchema => {
      if (
        itemSchema.type !== "object" ||
        !itemSchema.properties ||
        !itemSchema.properties.$exp
      ) {
        valueSchema = itemSchema;
      }
    });
    let paramType;
    let value;
    if (isObject(props.formData) && props.formData.$exp) {
      paramType = "exp";
      value = props.formData.$exp;
    } else {
      paramType = "value";
      value = props.formData;
    }

    this.state = {
      paramType,
      valueSchema,
      expSchema,
      value
    };
  }

  handleOnChange = (name, value) => {
    if (name === "paramType") {
      this.setState(
        {
          ...this.state,
          paramType: value,
          value: value === "value" ? null : []
        },
        () => {
          let formData;
          if (this.state.paramType === "value") {
            formData = this.state.value;
          } else {
            formData = { $exp: this.state.value };
          }
          this.props.onChange && this.props.onChange(formData);
        }
      );
    } else {
      this.setState(
        {
          ...this.state,
          [name]: value
        },
        () => {
          let formData;
          if (this.state.paramType === "value") {
            formData = this.state.value;
          } else {
            formData = { $exp: this.state.value };
          }
          this.props.onChange && this.props.onChange(formData);
        }
      );
    }
  };
  render() {
    return (
      <Grid container>
        <Grid item xs={3}>
          <Select
            value={this.state.paramType}
            onChange={event =>
              this.handleOnChange("paramType", event.target.value)
            }
          >
            <MenuItem value={"exp"}>Expression</MenuItem>
            <MenuItem value={"value"}>Value</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={9}>
          {this.state.paramType === "value" ? (
            <SchemaField
              {...this.props}
              schema={this.state.valueSchema}
              uiSchema={{}}
              formData={this.state.value}
              onChange={value => this.handleOnChange("value", value)}
            />
          ) : (
            <div>
              {this.props.schema.title || this.props.name}
              <FactSelector
                schema={this.props.factSelectorSchema}
                operators={this.props.factSelectorOperators}
                exp={this.state.value || []}
                onChange={value => this.handleOnChange("value", value)}
              />
            </div>
          )}
        </Grid>
      </Grid>
    );
  }
}
