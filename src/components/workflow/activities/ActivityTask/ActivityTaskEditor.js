import React, { Component } from "react";
import withActivityEditor from "../../common/withActivityEditor";
import TextEditor from "../../editors/TextEditor";
import T from "i18n-react";

class ActivityTaskEditor extends Component {
  handleChange = (field, value) => {
    this.props.onChange &&
      this.props.onChange({ ...this.props.activity, [field]: value });
  };

  render() {
    let errors = this.props.errors || {};
    return (
      <TextEditor
        label={T.translate("activity.name")}
        field="name"
        error={errors["name"]}
        value={this.props.activity.name}
        onChange={this.handleChange}
      />
    );
  }
}

const validator = (activity, workflowManager) => {
  let errors = {};
  if (!activity.name) {
    errors["name"] = T.translate("required");
  }
  return Object.keys(errors).length === 0 ? null : errors;
};

export default withActivityEditor(validator)(ActivityTaskEditor);
