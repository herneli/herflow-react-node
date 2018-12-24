import React, { Component } from "react";
import PropTypes from "prop-types";
import tokenSourceType from "../ruleit/tokenSourceType";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import IconOperator from "mdi-material-ui/FunctionVariant";
import IconProperty from "mdi-material-ui/WrenchOutline";
import IconRoot from "mdi-material-ui/CubeOutline";
import IconIndex from "mdi-material-ui/CodeBrackets";
import { withStyles } from "@material-ui/core/styles";
import FactSchemaMenu from "./FactSchemaMenu";
import getSchemaIcon from "./getSchemaIcon";
import OperatorEditor from "./OperatorEditor";

Boolean();
const styles = theme => ({
  root: {
    marginRight: 5
  },
  label: { paddingRight: 35, fontSize: 15 },
  deleteAvatar: {
    height: 30,
    width: 30,
    margin: 0
    // backgroundColor: theme.palette.secondary.dark,
    // color: theme.palette.primary.contrastText
  }
});
class FactPart extends Component {
  constructor(props) {
    super(props);
    this.state = { menuAnchor: false, operatorExp: null };
  }
  handleAction = event => {
    if (this.props.withMenu) {
      this.setState({ menuAnchor: event.currentTarget });
    }
  };
  getSourceIcon = source => {
    switch (source) {
      case tokenSourceType.root:
        return <IconRoot />;
      case tokenSourceType.property:
        return <IconProperty />;
      case tokenSourceType.operator:
        return <IconOperator />;
      case tokenSourceType.index:
        return <IconIndex />;
      default:
        return null;
    }
  };

  handleOnMenuClose = () => {
    this.setState({ menuAnchor: null });
  };
  handleOnMenuSelect = item => {
    switch (item.type) {
      case "property":
        this.setState({ menuAnchor: null });
        this.props.onAddExp && this.props.onAddExp(item.key);
        break;
      case "operator":
        this.setState({ menuAnchor: null, operatorExp: { op: item.key } });
        break;
      default:
    }
  };

  handleOnOperatorAdded = exp => {
    this.setState({ ...this.state, operatorExp: null });
    this.props.onAddExp && this.props.onAddExp(exp);
  };

  render() {
    let { token, classes } = this.props;
    let label = token.name;
    if (token.exp && token.exp.params && Object.keys(token.exp.params).length) {
      label = label + " with params: " + JSON.stringify(token.exp.params);
    }
    let sourceIcon = this.getSourceIcon(token.source);
    let schemaIcon = getSchemaIcon(token.schema);
    let menuOpen = Boolean(this.state.menuAnchor);
    return (
      <React.Fragment>
        <Chip
          className={classes.root}
          avatar={<Avatar>{sourceIcon}</Avatar>}
          label={label}
          color="primary"
          variant="outlined"
          onDelete={this.handleAction}
          deleteIcon={schemaIcon}
          classes={{ label: classes.label }}
        />
        {menuOpen ? (
          <FactSchemaMenu
            schema={token.schema}
            anchorEl={this.state.menuAnchor}
            open={menuOpen}
            onClose={this.handleOnMenuClose}
            onSelect={this.handleOnMenuSelect}
            operators={this.props.operators}
          />
        ) : null}
        {this.state.operatorExp ? (
          <OperatorEditor
            exp={this.state.operatorExp}
            operators={this.props.operators}
            onOperatorAdded={this.handleOnOperatorAdded}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

FactPart.propTypes = {
  token: PropTypes.object.isRequired,
  operators: PropTypes.object.isRequired,
  withMenu: PropTypes.bool
};

export default withStyles(styles)(FactPart);
