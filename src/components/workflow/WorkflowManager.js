import React from "react";
import "jsplumb";
import ActivityBox from "./activities/ActivityBox";
import ActivityInitial from "./activities/ActivityInitial";
import ActivityFinal from "./activities/ActivityFinal";
import ActivityTask from "./activities/ActivityTask";
import ActivityEmail from "./activities/ActivityEmail";
import ActivitySequence from "./activities/ActivitySequence";
import ActivityBranch from "./activities/ActivityBranch";
import ActivityLoop from "./activities/ActivityLoop";
import ActivityCondition from "./activities/ActivityCondition";
import _ from "lodash";

const arrowOverlay = {
  width: 6,
  length: 6,
  foldback: 0.8,
  location: 1
};

const defaultPaintStyle = {
  stroke: "#aaaaaa",
  strokeWidth: 2
};

class WorkflowManager {
  constructor(workflow) {
    // Create jsPlumbInstance
    let jsPlumb = window.jsPlumb;
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.setContainer("workflow-canvas");
    this.jsPlumbInstance.Defaults.PaintStyle = defaultPaintStyle;
    this.jsPlumbInstance.Defaults.Connector = [
      "Flowchart",
      { cornerRadius: 4, midpoint: 1, stub: 10 }
    ];
    this.jsPlumbInstance.Defaults.Endpoint = "Blank";
    this.jsPlumbInstance.Defaults.Anchor = ["Top", "Bottom"];

    // Register standard activities
    this.activities = [];
    this.registerActivity(ActivityInitial);
    this.registerActivity(ActivityFinal);
    this.registerActivity(ActivityTask);
    this.registerActivity(ActivityEmail);
    this.registerActivity(ActivitySequence);
    this.registerActivity(ActivityBranch);
    this.registerActivity(ActivityLoop);
    this.registerActivity(ActivityCondition);
    // Reset clipboard
    this.activityClipboard = null;

    // Bindings
    this.createConnections = this.createConnections.bind(this);
    this.connect = this.connect.bind(this);

    this.currentNewId = 0;
  }

  registerActivity(registerActivity) {
    this.activities.push(registerActivity);
  }

  newId() {
    this.currentNewId++;
    return "new-" + this.currentNewId;
  }

  setActivityClipboard(activity) {
    this.activityClipboard = activity;
  }

  getActivityClipboard() {
    return this.activityClipboard;
  }

  getSelectableActivities() {
    let selectableActivities = [];
    _.forEach(this.activities, function(activity) {
      if (!activity.excludeSelector) {
        selectableActivities.push(activity);
      }
    });
    return selectableActivities;
  }

  getActivityChart(activity) {
    const activityRegistry = _.find(this.activities, { type: activity.type });
    if (activityRegistry) {
      return activityRegistry.ActivityChart;
    } else {
      throw Error("Activity " + activity.type + " not found");
    }
  }

  getActivityEditor(activity) {
    const activityRegistry = _.find(this.activities, { type: activity.type });
    if (activityRegistry.ActivityEditor) {
      return activityRegistry.ActivityEditor;
    } else {
      return null;
    }
  }

  renderActivityBox(props) {
    return (
      <ActivityBox
        workflowManager={props.workflowManager}
        workflow={props.workflow}
        activity={props.activity}
        onCut={props.onCut}
        onChange={props.onChange}
      />
    );
  }

  renderChildrenActivities(activityNode) {
    let childrenActivities =
      activityNode.props.activity.childrenActivities || [];
    return childrenActivities.map(activity => {
      let ActivityChart = this.getActivityChart(activity);
      return (
        <td key={activity.id}>
          <ActivityChart
            workflowManager={this}
            workflow={activityNode.props.workflow}
            activity={activity}
            onChange={this.handleOnChangeChildren.bind(activityNode)}
          />
        </td>
      );
    });
  }

  generateActivity(type) {
    const activityRegistry = _.find(this.activities, { type: type });
    if (activityRegistry) {
      let activity = activityRegistry.generateActivity(this);
      if (activityRegistry.validate) {
        activity.errors = activityRegistry.validate(this, activity);
      }
      return activity;
    } else {
      throw Error("Activity " + type + " not found");
    }
  }

  handleOnChangeChildren(activity) {
    let childrenActivities = this.props.activity.childrenActivities || [];
    let index = _.findIndex(childrenActivities, { id: activity.id });
    let newChildren = [
      ...childrenActivities.slice(0, index),
      activity,
      ...childrenActivities.slice(index + 1)
    ];
    let newActivity = _.assign({}, this.props.activity, {
      childrenActivities: newChildren
    });

    this.props.onChange && this.props.onChange(newActivity);
  }

  connect(source, destination, options) {
    let connectObject = _.assign(
      {},
      { source: source, target: destination },
      options
    );
    this.jsPlumbInstance.connect(connectObject);
  }

  createConnectionsSequential(activity) {
    let returnNode;
    let nodes = [];
    let activityId = "activity-" + activity.id;
    if (!activity.isMain) {
      nodes.push({
        initial: activityId + "-label",
        final: activityId + "-label"
      });
    }
    activity.childrenActivities &&
      activity.childrenActivities.forEach(
        function(activity) {
          nodes.push(this.createConnections(activity));
        }.bind(this)
      );
    if (nodes.length > 0) {
      returnNode = {
        initial: nodes[0].initial,
        final: nodes[nodes.length - 1].final
      };
      if (nodes.length > 1) {
        for (let i = 0; i < nodes.length - 1; i++) {
          this.connect(
            nodes[i].final,
            nodes[i + 1].initial
          );
        }
      }
    }
    return returnNode;
  }

  createConnectionsParallel(activity, loop) {
    let activityId = "activity-" + activity.id;
    let finalPointId = activityId + "-final";

    if (activity.childrenActivities && activity.childrenActivities.length > 0) {
      activity.childrenActivities.forEach(
        function(childrenActivity) {
          let parallelNode = this.createConnections(childrenActivity);
          this.connect(
            activityId,
            parallelNode.initial
          );
          this.connect(
            parallelNode.final,
            finalPointId
          );
          if (loop) {
            let loopBackId = activityId + "-loop-back";
            this.connect(
              finalPointId,
              loopBackId,
              { anchor: "Left" }
            );
            this.connect(
              loopBackId,
              activityId,
              { anchor: "Left", overlays: [["Arrow", arrowOverlay]] }
            );
          }
        }.bind(this)
      );

      return { initial: activityId, final: finalPointId };
    } else {
      this.connect(
        activityId,
        finalPointId
      );
      return { initial: activityId, final: finalPointId };
    }
  }

  createConnectionsSingle(activity) {
    let activityId = "activity-" + activity.id;
    return { initial: activityId, final: activityId };
  }

  resetJsPlumb() {
    this.jsPlumbInstance.reset();
  }

  createConnections(activity) {
    const activityRegistry = _.find(this.activities, { type: activity.type });
    if (activityRegistry.createConnections) {
      return activityRegistry.createConnections(this, activity);
    } else {
      return this.createConnectionsSingle(activity);
    }
  }
}

export default WorkflowManager;
