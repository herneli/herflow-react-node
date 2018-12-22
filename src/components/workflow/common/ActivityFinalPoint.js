import React, { Component } from 'react';
class ActivityFinalPoint extends Component {
  render() {
    switch(this.props.activity.type){
      case "Loop":
        return (
          <div id={"activity-" + this.props.activity.id + "-final"} className="hf-loop-back" />
        );
      default:
        return (
          <div id={"activity-" + this.props.activity.id + "-final"} className="hf-final-point" />
        );
    }
  }
}

export default ActivityFinalPoint;