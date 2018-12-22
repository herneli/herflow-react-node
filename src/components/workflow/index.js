import React, { Component } from "react";
import WorkflowManager from "./WorkflowManager";
import ZoomSelector from "./common/ZoomSelector";
import _ from "lodash";
import "./Workflow.css";

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.handleOnChangeMainActivity = this.handleOnChangeMainActivity.bind(
      this
    );
    this.handleZoomSelected = this.handleZoomSelected.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      zoom: 1,
      originalWorkflow: this.props.workflow,
      workflow: this.props.workflow
    };
    this.workflowManager = new WorkflowManager(this.state.workflow);
  }

  componentDidMount() {
    if (this.state.workflow) {
      this.repaint();
    }
    window.addEventListener("resize", this.handleResize);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.originalWorkflow !== props.workflow) {
      return {
        ...state,
        originalWorkflow: props.workflow,
        workflow: props.workflow
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.repaint();
  }

  handleResize() {
    this.repaint();
  }

  repaint() {
    if (this.state.workflow) {
      this.workflowManager.resetJsPlumb();
      this.workflowManager.createConnections(this.state.workflow.mainActivity);
    }
  }

  handleOnChangeMainActivity(activity) {
    let newWorkflow = _.assign({}, this.state.workflow, {
      mainActivity: activity
    });
    console.log("handleOnChangeMainActivity");
    this.setState({ workflow: newWorkflow });
  }

  handleZoomSelected(zoom) {
    this.setState({ ...this.state, zoom });
  }

  render() {
    if (this.workflowManager.workflow !== this.state.workflow) {
      this.workflowManager.workflow = this.state.workflow;
    }
    if (this.state.workflow) {
      console.log("render");
      const ActivityChart = this.workflowManager.getActivityChart(
        this.state.workflow.mainActivity
      );
      return (
        <div>
          <ZoomSelector onSelected={this.handleZoomSelected} />

          <div id="workflow-canvas" style={{ zoom: this.state.zoom }}>
            <ActivityChart
              workflowManager={this.workflowManager}
              workflow={this.state.workflow}
              activity={this.state.workflow.mainActivity}
              onChange={this.handleOnChangeMainActivity}
            />
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default Workflow;
