import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import T from "i18n-react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function withActivityEditor(validator) {
  return function(Editor) {
    return class ActivityEdit extends React.Component {
      constructor(props) {
        super(props);

        // State
        this.state = { activity: this.props.activity, errors: null };

        // Bindings
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
        this.handleOnSave = this.handleOnSave.bind(this);
      }

      componentWillReceiveProps(nextProps) {
        if (this.props.activity !== nextProps.activity) {
          this.setState({ activity: nextProps.activity, errors: null });
        }
      }

      handleOnChange(activity) {
        this.setState({
          activity: activity,
          errors: null
        });
      }

      handleOnClose() {
        this.props.onClose && this.props.onClose(null);
      }

      handleOnSave() {
        let errors = validator(this.state.activity, this.props.workflowManager);
        if (errors) {
          this.setState({ errors: errors });
        } else {
          this.props.onClose && this.props.onClose(this.state.activity);
        }
      }

      render() {
        if (!this.props.open) {
          return null;
        }
        return (
          <Dialog open={this.props.open} fullWidth={true} maxWidth="md">
            <DialogTitle id="form-dialog-title">
              {T.translate("activity.editTitle")}
            </DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <Editor
                    activity={this.state.activity}
                    errors={this.state.errors}
                    onChange={this.handleOnChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleOnClose} color="primary">
                {T.translate("cancel")}
              </Button>
              <Button
                onClick={this.handleOnSave}
                variant="contained"
                color="primary"
              >
                {T.translate("save")}
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
    };
  };
}
