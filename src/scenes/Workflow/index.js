import React, { Component } from "react";
import { loadWorkflow, saveWorkflow } from "../../modules/workflow";
import { connect } from "react-redux";
import Workflow from "../../components/workflow";

class WorkflowDev extends Component {
  componentDidMount() {
    this.props.onLoadWorkflow(1);
  }

  render() {
    console.log("render main");
    return (
      <Workflow workflow={this.props.workflow} onChange={this.props.onChange} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    workflow: state.workflow.activeWorkflow,
    activityClipboard: state.workflow.activityClipboard
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoadWorkflow: workflowId => {
      dispatch(loadWorkflow(workflowId));
    },
    onChange: workflow => {
      dispatch(saveWorkflow(workflow));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowDev);
