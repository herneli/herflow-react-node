import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconOperator from "mdi-material-ui/FunctionVariant";
import { withStyles } from "@material-ui/core";
import { isFunction } from "lodash";
import Form from "../Form";

const styles = theme => ({
  iconType: {
    color: theme.palette.primary.light
  }
});

class OperatorEditor extends Component {
  constructor(props) {
    super(props);
    let params = this.props.exp && this.props.exp.params;
    this.state = { params: params || {}, schema: this.getParamSchema() };
    this.formRef = null;
  }

  componentDidMount = () => {
    if (!this.state.schema) {
      this.props.onOperatorAdded({ op: this.props.exp.op });
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
  handleOnSubmit = value => {
    this.props.onOperatorAdded({
      op: this.props.exp.op,
      params: value.formData
    });
  };

  render() {
    if (!this.state.schema) {
      return null;
    }
    return (
      <Dialog onClose={this.handleClose} open={true} fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          <IconOperator /> {this.props.exp.op}
        </DialogTitle>
        <DialogContent>
          <Form
            schema={this.state.schema}
            formData={this.state.params}
            onSubmit={this.handleOnSubmit}
            ref={form => {
              this.formRef = form;
            }}
          >
            <DialogActions>
              <Button onClick={this.props.onEditorClose}>Cancel</Button>
              <Button type="submit" onClick={this.handleAdd} color="primary">
                Add operator
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
        <DialogActions />
      </Dialog>
    );
  }
}

OperatorEditor.propTypes = {
  exp: PropTypes.object,
  operators: PropTypes.object
};

export default withStyles(styles)(OperatorEditor);
