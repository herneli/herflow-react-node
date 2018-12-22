import React, { Component } from 'react';
import ActivityParallel from '../ActivityParallel';
import './ActivityCondition.css';

class ActivityBranch extends Component {
  render() {
    return (
      <ActivityParallel {...this.props} />
    )
  }
}

export default ActivityBranch;