import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconAdd from "@material-ui/icons/Add";
import IconDelete from "@material-ui/icons/Delete";
import CombinatorSelect from "./CombinatorSelect";
import Rule from "./Rule";

let styles = {
  ruleGroup: {
    padding: 5,
    paddingLeft: 40,
    border: "1px solid #CCC",
    borderRadius: 4,
    background: "rgba(238, 238, 238, 0.3)",
    marginTop: 10
  },
  addRuleButton: {
    marginLeft: 20
  },
  addGroupButton: {
    marginLeft: 20
  },
  removeGroupButton: {
    marginLeft: 20
  }
};

class RuleGroup extends Component {
  handleChange = (name, value) => {
    this.props.onChange({ ...this.props.rule, [name]: value });
  };

  handleAddRule = () => {
    this.props.onChange({
      ...this.props.rule,
      rules: [...this.props.rule.rules, { type: "exp" }]
    });
  };

  handleAddGroup = () => {
    this.props.onChange({
      ...this.props.rule,
      rules: [
        ...this.props.rule.rules,
        { type: "group", combinator: "all", rules: [] }
      ]
    });
  };

  handleRuleItemChange = (index, value) => {
    let newRules = [
      ...this.props.rule.rules.slice(0, index),
      value,
      ...this.props.rule.rules.slice(index + 1)
    ];
    this.props.onChange({ ...this.props.rule, rules: newRules });
  };
  handleRuleItemDelete = (index, value) => {
    let newRules = [
      ...this.props.rule.rules.slice(0, index),
      ...this.props.rule.rules.slice(index + 1)
    ];
    this.props.onChange({ ...this.props.rule, rules: newRules });
  };
  render() {
    let { rule, classes } = this.props;
    let ruleComponents = rule.rules.map((rule, index) => {
      return (
        <Rule
          key={index}
          rule={rule}
          schema={this.props.schema}
          operators={this.props.operators}
          contextName={this.props.contextName}
          onChange={value => this.handleRuleItemChange(index, value)}
          onDelete={() => this.handleRuleItemDelete(index)}
        />
      );
    });
    return (
      <div className={classes.ruleGroup}>
        {rule.rules.length > 1 ? (
          <CombinatorSelect
            value={rule.combinator}
            onChange={value => this.handleChange("combinator", value)}
          />
        ) : null}
        <Button
          className={classes.addRuleButton}
          size="small"
          variant="contained"
          onClick={this.handleAddRule}
        >
          <IconAdd fontSize="small" />
          Add rule
        </Button>
        <Button
          className={classes.addGroupButton}
          size="small"
          variant="contained"
          onClick={this.handleAddGroup}
        >
          <IconAdd fontSize="small" />
          Add group
        </Button>
        {this.props.onDelete ? (
          <Button
            className={classes.removeGroupButton}
            size="small"
            variant="contained"
            color="secondary"
            onClick={this.props.onDelete}
          >
            <IconDelete fontSize="small" />
          </Button>
        ) : null}

        {ruleComponents}
      </div>
    );
  }
}

RuleGroup.propTypes = {
  rule: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

let RuleGroupContainer = withStyles(styles)(RuleGroup);
export default RuleGroupContainer;
