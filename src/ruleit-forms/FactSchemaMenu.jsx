import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { getOperatorsByType } from "../ruleit/operators";
import IconOperator from "mdi-material-ui/FunctionVariant";
import IconProperty from "mdi-material-ui/WrenchOutline";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import getSchemaIcon from "./getSchemaIcon";

export default class FactSchemaMenu extends Component {
  handleOnSelect = item => {
    this.props.onSelect && this.props.onSelect(item);
  };
  render() {
    let { open, anchorEl, schema } = this.props;

    let menuItems = [];
    if (schema.type === "object" && schema.properties) {
      menuItems = Object.keys(schema.properties).map(propertyKey => {
        let propertyIcon = getSchemaIcon(schema.properties[propertyKey]);
        return (
          <MenuItem
            key={"prop-" + propertyKey}
            onClick={() =>
              this.handleOnSelect({ type: "property", key: propertyKey })
            }
          >
            <ListItemIcon>{propertyIcon}</ListItemIcon>
            <ListItemText inset primary={propertyKey} />
          </MenuItem>
        );
      });
    }
    let operators = getOperatorsByType(schema.type);
    Object.keys(operators).forEach(operatorKey => {
      menuItems.push(
        <MenuItem
          key={"op" + operatorKey}
          onClick={() =>
            this.handleOnSelect({ type: "operator", key: operatorKey })
          }
        >
          <ListItemIcon>
            <IconOperator />
          </ListItemIcon>
          <ListItemText inset primary={operatorKey} />
        </MenuItem>
      );
    });

    if (menuItems.length > 0) {
      return (
        <Menu anchorEl={anchorEl} open={open} onClose={this.props.onClose}>
          {menuItems}
        </Menu>
      );
    } else {
      return null;
    }
  }
}
