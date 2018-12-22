import ActivityChart from "./ActivityCondition";
import Image from "../../images/activityCondition32.png";
import T from "i18n-react";

export default {
  type: "Condition",
  name: "activity.condition",
  image: Image,
  ActivityChart,
  createConnections(workflowManager, activity) {
    return workflowManager.createConnectionsParallel(activity);
  },
  generateActivity: workflowManager => {
    return {
      id: workflowManager.newId(),
      name: T.translate("activity.newCondition"),
      type: "Condition",
      childrenActivities: [
        {
          id: workflowManager.newId(),
          type: "Sequence",
          label: T.translate("activity.conditionTrue")
        },
        {
          id: workflowManager.newId(),
          type: "Sequence",
          label: T.translate("activity.conditionFalse")
        }
      ]
    };
  }
};
