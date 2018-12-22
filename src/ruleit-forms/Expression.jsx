import React, { Component } from "react";
import PropTypes from "prop-types";
import Rule from "./Rule";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import T from "i18n-react";

class Expression extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      rule: { type: "group", combinator: "all", rules: [] }
    };
  }
  handleOnChange = value => {
    this.setState({ rule: value });
  };

  handleSave = () => {
    this.setState({ dialogOpen: false });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };
  handleOnEdit = () => {
    this.setState({ dialogOpen: true });
  };
  render() {
    return (
      <div>
        <span>{JSON.stringify(this.state.rule)}</span>
        <Button variant="raised" onClick={this.handleOnEdit}>
          Edit
        </Button>
        <Dialog open={this.state.dialogOpen} maxWidth="xl" fullWidth={true}>
          <DialogTitle>
            <T.span text="forms.ruleEditor" />
          </DialogTitle>
          <DialogContent>
            <Rule
              rule={this.state.rule}
              schema={this.props.schema}
              onChange={this.handleOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              <T.span text="close" />
            </Button>
            <Button onClick={this.handleSave} color="primary">
              <T.span text="save" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Expression.propTypes = {
  conditions: PropTypes.object
};

export default Expression;
