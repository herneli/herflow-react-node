import {
  Component
} from 'react';
import './ActivityTask.css';

class ActivityTask extends Component {
  render() {
    return (
      this.props.workflowManager.renderActivityBox(this.props)
    );
  }
}

export default ActivityTask;