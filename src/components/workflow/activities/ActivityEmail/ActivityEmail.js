import {
  Component
} from 'react';
import './ActivityEmail.css';

class ActivityEmail extends Component {
  render() {
    return (
      this.props.workflowManager.renderActivityBox(this.props)
    );
  }
}

export default ActivityEmail;