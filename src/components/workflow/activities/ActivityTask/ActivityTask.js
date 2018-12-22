import React from 'react';
import './ActivityTask.css';

class ActivityTask extends React.Component {
  render() {
    return (
      this.props.workflowManager.renderActivityBox(this.props)
    );
  }
}

export default ActivityTask;