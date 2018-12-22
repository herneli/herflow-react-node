import React, { Component } from "react";
import ActivityStatus from "../common/ActivityStatus";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Error from "@material-ui/icons/Error";
import _ from "lodash";
import T from "i18n-react";
import "./Activity.css";

class ActivityBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      anchorEl: null,
      edit: false
    };
    // Bindings
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuSelected = this.handleMenuSelected.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleOnEditClose = this.handleOnEditClose.bind(this);
  }

  handleMenuClick(event) {
    this.setState(
      _.assign({}, this.state, {
        menuOpen: true,
        anchorEl: event.currentTarget
      })
    );
  }

  handleMenuSelected(selected) {
    switch (selected) {
      case "cut":
        this.setState(
          _.assign({}, this.state, { menuOpen: false, anchorEl: null })
        );
        this.props.onCut && this.props.onCut(this.props.activity);
        break;
      case "edit":
        this.setState(
          _.assign({}, this.state, {
            menuOpen: false,
            anchorEl: null,
            edit: true
          })
        );
        break;
      default:
      // Nothing
    }
  }

  handleMenuClose() {
    this.setState(
      _.assign({}, this.state, { menuOpen: false, anchorEl: null })
    );
  }

  handleOnEditClose(activity) {
    this.setState(_.assign({}, this.state, { edit: false }));
    if (activity) {
      this.props.onChange && this.props.onChange(activity);
    }
  }

  getActivityClass() {
    return "hf-activity-" + _.kebabCase(this.props.activity.type);
  }

  getActivityStatusClass() {
    let activityStatusClass = "";
    if (this.props.workflow.isInstance) {
      switch (this.props.activity.status) {
        case ActivityStatus.Closed:
          activityStatusClass = " hf-activity-closed";
          break;
        case ActivityStatus.Started:
          activityStatusClass = " hf-activity-started";
          break;
        case ActivityStatus.Cancelled:
          activityStatusClass = " hf-activity-cancelled";
          break;
        default:
          activityStatusClass = "";
      }
    }
    return activityStatusClass;
  }

  showCutMenu() {
    switch (this.props.activity.type) {
      case "Initial":
      case "Final":
      case "Sequence":
        return false;
      default:
        return true;
    }
  }

  render() {
    let activityStatusClass = this.getActivityStatusClass();
    let ActivityEditor = this.props.workflowManager.getActivityEditor(
      this.props.activity
    );
    return (
      <div
        id={"activity-" + this.props.activity.id}
        className={"hf-activity " + this.getActivityClass()}
      >
        <div className="hf-activity-icon" />
        {this.props.activity.errors ? (
          <div className="hf-activity-alert">
            <Error />
          </div>
        ) : null}
        <div className="hf-activity-description hf-ellipsis-2">
          <p>{this.props.activity.name}</p>
        </div>
        <div className={"hf-activity-status" + activityStatusClass} />
        <div className="hf-activity-menu">
          <IconButton
            aria-owns={"simple-menu"}
            aria-haspopup="true"
            onClick={this.handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.menuOpen}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={() => this.handleMenuSelected("edit")}>
              <T.span text="edit" />
            </MenuItem>
            {this.showCutMenu() ? (
              <MenuItem onClick={() => this.handleMenuSelected("cut")}>
                <T.span text="cut" />
              </MenuItem>
            ) : null}
          </Menu>
          {this.state.edit && ActivityEditor ? (
            <ActivityEditor
              open={this.state.edit}
              workflowManager={this.props.workflowManager}
              activity={this.props.activity}
              onClose={this.handleOnEditClose}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ActivityBox;
