import ActivityChart from "./ActivityEmail";
import T from "i18n-react";
import Image from "../../images/activityEmail32.png";

export default {
  type: "Email",
  name: "activity.email",
  image: Image,
  ActivityChart,
  generateActivity: workflowManager => {
    return {
      id: workflowManager.newId(),
      name: T.translate("activity.newEmail"),
      type: "Email"
    };
  }
};
