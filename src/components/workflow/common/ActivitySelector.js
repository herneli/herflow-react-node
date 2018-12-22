import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import T from "i18n-react";
import ImageClipboard from "../images/clipboard.png";

class ActivitySelector extends Component {
  getActivities() {
    let activities = [];
    if (this.props.workflowManager.getActivityClipboard()) {
      activities.push({
        type: "clipboard",
        image: ImageClipboard,
        name: "activity.clipboard"
      });
    }
    activities = activities.concat(
      this.props.workflowManager.getSelectableActivities()
    );
    return activities;
  }

  handleClose = () => {
    this.props.onClose(null);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    return (
      <Dialog onClose={this.handleClose} open={this.props.open}>
        <DialogTitle id="simple-dialog-title">
          <T.span text="workflow.selectActivity" />
        </DialogTitle>
        <div>
          <List dense={true}>
            {this.getActivities().map((activity, index) => (
              <ListItem
                button
                onClick={() => this.handleListItemClick(activity)}
                key={index}
              >
                <Avatar
                  src={activity.image}
                  style={{ height: 24, width: 24 }}
                />
                <ListItemText primary={T.translate(activity.name)} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

export default ActivitySelector;
