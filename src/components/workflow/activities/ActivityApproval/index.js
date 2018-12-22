import React from "react";
import ActivityChart from "./ActivityTask";
import Image from "../../images/activityTask32.png";
import T from "i18n-react";

const generateActivity = workflowManager => {
  return {
    id: workflowManager.newId(),
    name: T.translate("activity.newTask"),
    type: "Task"
  };
};

const validate = (workflowManager, activity) => {
  const errors = [];
  if (!activity.name) {
    errors.push({
      message: T.translate("required")
    });
  }
  return errors.length > 0 ? errors : null;
};

class Editor extends React.Component {
  render() {
    return (
      <div>
        <h1>HelloWorld</h1>
      </div>
    );
  }
}

export default {
  type: "Task",
  name: "activity.task",
  image: Image,
  ActivityChart,
  ActivityEditor: Editor,
  generateActivity,
  validate
};
