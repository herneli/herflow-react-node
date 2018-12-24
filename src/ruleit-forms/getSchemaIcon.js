import React from "react";
import IconObject from "mdi-material-ui/Json";
import IconNumber from "mdi-material-ui/Numeric";
import IconString from "mdi-material-ui/Alphabetical";
import IconBoolean from "mdi-material-ui/ToggleSwitch";
import IconArray from "mdi-material-ui/Contain";
import IconDate from "mdi-material-ui/Calendar";

const getSchemaIcon = (schema, props = {}) => {
  switch (schema.type) {
    case "string":
      switch (schema.format) {
        case "date":
          return <IconDate {...props} fontSize="small" />;
        default:
          return <IconString {...props} fontSize="small" />;
      }
    case "object":
      return <IconObject {...props} fontSize="small" />;
    case "array":
      return <IconArray {...props} fontSize="small" />;
    case "number":
    case "integer":
      return <IconNumber {...props} fontSize="small" />;
    case "boolean":
      return <IconBoolean {...props} fontSize="small" />;

    default:
      return null;
  }
};

export default getSchemaIcon;
