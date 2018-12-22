import React, { Component } from 'react';

class ActivityLabel extends Component {
  render() {
    if (this.props.activity.label){
      return (
        <div id={"activity-" + this.props.activity.id + "-label"} className="hf-label">
          {this.props.activity.label}
        </div>
      );
    }else{
      return (
        <div id={"activity-" + this.props.activity.id + "-label"} className="hf-no-label" />
      );      
    }
  }
}

export default ActivityLabel;