import React, { Component } from "react";
import PropTypes from "prop-types";
import Rule from "./Rule";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import T from "i18n-react";

class RuleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      rule: this.props.rule
    };
  }

  handleOnChange = value => {
    this.setState({ rule: value });
  };

  handleSave = () => {
    this.setState({ dialogOpen: false });
    this.props.onSave && this.props.onSave(this.state.rule);
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
        <Button variant="contained" onClick={this.handleOnEdit}>
          Edit
        </Button>
        <Dialog open={this.state.dialogOpen} maxWidth="lg" fullWidth={true}>
          <DialogTitle>
            <T.span text="forms.ruleEditor" />
          </DialogTitle>
          <DialogContent>
            <Rule
              rule={this.state.rule}
              schema={this.props.schema}
              operators={this.props.operators}
              contextName={this.props.contextName}
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

RuleEditor.propTypes = {
  conditions: PropTypes.object,
  schema: PropTypes.object.isRequired,
  operators: PropTypes.object
};

export default RuleEditor;
