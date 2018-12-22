import ActivityChart from "./ActivityFinal";
import Image from "../../images/activityFinal32.png";
import T from "i18n-react";

export default {
  type: "Final",
  name: T.translate("activity.final"),
  image: Image,
  excludeSelector: true,
  ActivityChart
};
