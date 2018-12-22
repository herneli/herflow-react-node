import {
  Component
} from 'react';
import './ActivityFinal.css';


class ActivityFinal extends Component {
  render() {
    return (
      this.props.workflowManager.renderActivityBox(this.props)
    );
  }
}

export default ActivityFinal;