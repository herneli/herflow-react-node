import ActivityChart from "./ActivityLoop";
import Image from "../../images/activityLoop32.png";
import T from "i18n-react";

export default {
  type: "Loop",
  name: "activity.loop",
  image: Image,
  ActivityChart,
  createConnections(workflowManager, activity) {
    return workflowManager.createConnectionsParallel(activity, true);
  },
  generateActivity: workflowManager => {
    return {
      id: workflowManager.newId(),
      name: T.translate("activity.newLoop"),
      type: "Loop",
      childrenActivities: [
        {
          id: workflowManager.newId(),
          type: "Sequence",
          branchName: "loop"
        }
      ]
    };
  }
};
