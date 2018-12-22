import ActivityChart from "./ActivityBranch";
import Image from "../../images/activityBranch32.png";
import T from "i18n-react";

export default {
  type: "Branch",
  name: "activity.branch",
  image: Image,
  ActivityChart,
  createConnections(workflowManager, activity) {
    return workflowManager.createConnectionsParallel(activity);
  },
  generateActivity: workflowManager => {
    return {
      id: workflowManager.newId(),
      name: T.translate("activity.newBranch"),
      type: "Branch",
      childrenActivities: [
        {
          id: workflowManager.newId(),
          type: "Sequence",
          label: T.translate("activity.branchNumber", { branchNumber: 1 })
        },
        {
          id: workflowManager.newId(),
          type: "Sequence",
          label: T.translate("activity.branchNumber", { branchNumber: 2 })
        }
      ]
    };
  }
};
