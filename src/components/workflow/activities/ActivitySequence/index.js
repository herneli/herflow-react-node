import React, { Component } from 'react';
import ActivityLabel from '../../common/ActivityLabel';
import ActivityInsert from '../../common/ActivityInsert';
import AcitivitySelector from '../../common/ActivitySelector';
import _ from 'lodash';
import './ActivitySequence.css';  

class ActivitySequence extends Component {
  constructor(props) {
    super(props);
    this.state = { insertDialog: false };

    // Bindings
    this.handleInsertActivity = this.handleInsertActivity.bind(this);
    this.handleCloseSelector = this.handleCloseSelector.bind(this);
    this.handleOnChangeChildren = this.props.workflowManager.handleOnChangeChildren.bind(this);
    this.handleOnCut = this.handleOnCut.bind(this);
  }

  getChildrenActivities() {
    return this.props.activity.childrenActivities || [];
  }

  handleInsertActivity(insertIndex) {
    this.setState({ insertDialog: true, insertIndex });
  }

  handleCloseSelector(activity) {
    if (activity) {
      let addedActivity;
      let children = this.getChildrenActivities();
      if (activity.type === 'clipboard'){
        addedActivity = this.props.workflowManager.getActivityClipboard();
      }else{
        addedActivity = this.props.workflowManager.generateActivity(activity.type);
      }
      
      let newActivity = _.assign({}, this.props.activity, {
        childrenActivities: [
          ...children.slice(0, this.state.insertIndex),
          addedActivity,
          ...children.slice(this.state.insertIndex, children.length)
        ]
      });
      this.props.onChange && this.props.onChange(newActivity);

      if (activity.type === 'clipboard'){
        this.props.workflowManager.setActivityClipboard(null);
      }
    }
    this.setState({ insertDialog: false });
  }

  handleOnCut(activity){
    // Remove from current sequence
    let children = this.getChildrenActivities();
    let activityIndex = _.findIndex(children,{'id': activity.id});
    let newActivity = _.assign({}, this.props.activity, {
      childrenActivities: [
        ...children.slice(0, activityIndex),
        ...children.slice(activityIndex+1, children.length)
      ]
    });
    this.props.workflowManager.setActivityClipboard(activity);
    this.props.onChange && this.props.onChange(newActivity);
  }

  renderChildrenActivities() {
    let childrenActivities = this.getChildrenActivities();

    let returnNodes = [];
    if (!this.props.activity.isMain) {
      returnNodes.push(
        <tr key={this.props.activity.id + "-ins-first"}>
          <td>
            <ActivityInsert
              insertIndex={0}
              onClick={this.handleInsertActivity} />
          </td>
        </tr>
      );
    }
    childrenActivities.forEach((activity, index) => {
      const ActivityChart = this.props.workflowManager.getActivityChart(activity);
      returnNodes.push(
        <tr key={activity.id}>
          <td>
            <ActivityChart
              workflowManager={this.props.workflowManager}
              workflow={this.props.workflow}
              activity={activity}
              onChange={this.handleOnChangeChildren} 
              onCut={this.handleOnCut}/>
          </td>
        </tr>
      );
      if (activity.type !== "Final") {
        returnNodes.push(
          <tr key={activity.id + "-ins"}>
            <td>
              <ActivityInsert
                insertIndex={index + 1}
                onClick={this.handleInsertActivity} />
            </td>
          </tr>
        );
      }
    });
    return returnNodes;
  }
  render() {
    this.anchors = [];

    return (
      <div>
        <table className={"hf-workflow" + (this.props.activity.isMain ? " main": "")}>
          <tbody>
            {!this.props.activity.isMain ?
              <tr>
                <td>
                  <ActivityLabel activity={this.props.activity} />
                </td>
              </tr> : null}
            {this.renderChildrenActivities()}
          </tbody>
        </table>
        <AcitivitySelector
          open={this.state.insertDialog}
          workflowManager={this.props.workflowManager}
          activityClipboard={this.props.activityClipboard}
          onClose={this.handleCloseSelector} />
      </div>
    );
  }
}


export default {
  type: "Sequence",
  name: 'Sequence',
  excludeSelector: true,
  ActivityChart: ActivitySequence,
  createConnections(manager,activity){
    return manager.createConnectionsSequential(activity);
  }
}