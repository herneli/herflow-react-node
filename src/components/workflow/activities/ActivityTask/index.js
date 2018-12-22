import ActivityTask from "./ActivityTask";
import ActivityTaskEditor from "./ActivityTaskEditor";
import Image from "../../images/activityTask32.png";
import T from "i18n-react";

const generateActivity = workflowManager => {
  return {
    id: workflowManager.newId(),
    name: T.translate("activity.newTask"),
    type: "Task"
  };
};

export default {
  type: "Task",
  name: "activity.task",
  image: Image,
  ActivityChart: ActivityTask,
  generateActivity,
  ActivityEditor: ActivityTaskEditor
};
