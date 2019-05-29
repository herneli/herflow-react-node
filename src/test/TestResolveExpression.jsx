import React, { Component } from "react";
import resolveExpression from "../ruleit/resolveExpression";
import InputBase from "@material-ui/core/InputBase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import RuleEditor from "ruleit-forms/components/rules/RuleEditor";
import schema from "./schema.json";
import operators from "ruleit/operators";
import Engine from "../ruleit/RuleEngine";

let user = {
  firstName: "Jordi",
  lastName: "Hernandez",
  addresses: [{ city: "Terrassa" }, { city: "Barcelona" }]
};

let exp = ["addresses"];

const styles = {
  root: {
    padding: 40
  },
  paper: {
    padding: 10,
    margin: 10
  },
  button: {
    marginTop: 20
  }
};
class TestResolveExpression extends Component {
  constructor(props) {
    super(props);
    this.state = {
      context: JSON.stringify(user, null, 2),
      exp: JSON.stringify(exp, null, 2),
      rule: { type: "group", combinator: "all", rules: [] }
    };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleValidateExpression = () => {
    let context = JSON.parse(this.state.context);
    let exp = JSON.parse(this.state.exp);
    try {
      let expressionResult = resolveExpression(context, exp);
      this.setState({ ...this.state, expressionResult });
    } catch (error) {
      this.setState({ ...this.state, expressionResult: error.message });
    }
  };

  handleValidateRule = () => {
    let engine = new Engine({ condition: this.state.rule });
    let context = JSON.parse(this.state.context);
    engine
      .run(context)
      .then(response => {
        let expressionResult = { responseType: "Ok", response: response };
        this.setState({ ...this.state, expressionResult });
      })
      .catch(reason => {
        let expressionResult = {
          responseType: "Error",
          response: reason.message
        };
        this.setState({ ...this.state, expressionResult });
      });
  };

  handleSaveRule = rule => {
    this.setState({ ...this.state, rule: rule });
  };

  render() {
    let { classes } = this.props;
    return (
      <div className={classes.root}>
        <h1>Test getValue</h1>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <h2>Context</h2>
            <Paper className={classes.paper}>
              <InputBase
                multiline={true}
                label="Context"
                value={this.state.context}
                onChange={this.handleChange("context")}
                fullWidth
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <h2>Expression</h2>
            <Paper className={classes.paper}>
              <InputBase
                multiline={true}
                label="Expression"
                value={this.state.exp}
                onChange={this.handleChange("exp")}
                fullWidth
              />
            </Paper>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.handleValidateExpression}
            >
              Validate
            </Button>
            <h2>Rule</h2>
            <Paper className={classes.paper}>
              <RuleEditor
                schema={schema}
                rule={this.state.rule}
                contextName="User"
                operators={operators}
                onSave={this.handleSaveRule}
              />
            </Paper>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.handleValidateRule}
            >
              Validate
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <h1>Results</h1>
              {JSON.stringify(this.state.expressionResult, null, 2)}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(TestResolveExpression);
