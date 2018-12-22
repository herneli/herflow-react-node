import React, { Component } from 'react';
import ActivityFinalPoint from '../common/ActivityFinalPoint';

class ActivityParallel extends Component {
  render() {
    return (
      <table className="hf-workflow">
        <tbody>
          <tr>
            <td id={"activity-" + this.props.activity.id + "-loop-back"}>
              {this.props.workflowManager.renderActivityBox(this.props)}
            </td>
          </tr>
          <tr>
            <td>
              <table className="hf-workflow">
                <tbody>
                  <tr>
                    {this.props.workflowManager.renderChildrenActivities(this)}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <ActivityFinalPoint activity={this.props.activity} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ActivityParallel;

