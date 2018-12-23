import React from "react";
import IconObject from "mdi-material-ui/Json";
import IconNumber from "mdi-material-ui/Numeric";
import IconString from "mdi-material-ui/Alphabetical";
import IconBoolean from "mdi-material-ui/ToggleSwitch";
import IconArray from "mdi-material-ui/Contain";
import IconDate from "mdi-material-ui/Calendar";

const getSchemaIcon = schema => {
  switch (schema.type) {
    case "string":
      return <IconString fontSize="small" />;
    case "object":
      return <IconObject fontSize="small" />;
    case "array":
      return <IconArray fontSize="small" />;
    case "number":
      return <IconNumber fontSize="small" />;
    case "boolean":
      return <IconBoolean fontSize="small" />;
    case "date":
      return <IconDate fontSize="small" />;
    default:
      return null;
  }
};

export default getSchemaIcon;
