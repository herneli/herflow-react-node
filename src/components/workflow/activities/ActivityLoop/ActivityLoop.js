import React, { Component } from 'react';
import ActivityParallel from '../ActivityParallel';
import './ActivityLoop.css';

class ActivityLoop extends Component {
  render() {
    return (
      <ActivityParallel {...this.props} />
    )
  }
}

export default ActivityLoop;

