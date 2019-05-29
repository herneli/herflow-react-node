import React, { Component } from "react";
import resolveExpression from "../ruleit/resolveExpression";
import InputBase from "@material-ui/core/InputBase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

let user = {
  firstName: "Jordi",
  lastName: "Hernandez",
  addresses: [{ city: "Terrassa" }, { city: "Barcelona" }]
};

let exp = ["addresses", { op: "toLower" }];

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
      exp: JSON.stringify(exp, null, 2)
    };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleValidate = () => {
    let context = JSON.parse(this.state.context);
    let exp = JSON.parse(this.state.exp);
    try {
      let expressionResult = resolveExpression(context, exp);
      this.setState({ ...this.state, expressionResult });
    } catch (error) {
      console.log(error.message);
      this.setState({ ...this.state, expressionResult: error.message });
    }
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
              onClick={this.handleValidate}
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
