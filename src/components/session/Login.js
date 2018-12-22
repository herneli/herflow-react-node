import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import GoogleIcon from "../img/logo_google_white_22x22.png";
import useRocheLogin from "./useRocheLogin";
import T from "i18n-react";
import axios from "axios";

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class Login extends Component {
  componentDidMount() {
    if (this.props.tryAutoLogin) {
      this.tryToConnectWithGoogleAccount();
    }
  }

  getTokenUsingGoogle() {
    window.gapi.load(
      "auth2",
      function() {
        window.gapi.auth2
          .init({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            fetch_basic_profile: true,
            scope: "profile"
          })
          .then(
            function(auth) {
              if (auth.isSignedIn.get() === true) {
                const authResponse = window.gapi.auth2
                  .getAuthInstance()
                  .currentUser.get()
                  .getAuthResponse();
                axios
                  .get(
                    process.env.REACT_APP_AUTH_URL +
                      "/Auth/LogInWithGoogleToken",
                    {
                      params: {
                        token: authResponse.id_token,
                        applicationId: process.env.REACT_APP_APPLICATION_ID
                      }
                    }
                  )
                  .then(
                    function(response) {
                      if (response.data.success) {
                        this.props.onLoginSuccess &&
                          this.props.onLoginSuccess(response.data.tokens);
                      } else {
                        this.props.onLoginFailure &&
                          this.props.onLoginFailure(response.data);
                      }
                    }.bind(this)
                  )
                  .catch(function() {});
              } else {
              }
            }.bind(this)
          );
      }.bind(this)
    );
  }

  tryToConnectWithGoogleAccount() {
    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.async = true;
      script.onload = this.getTokenUsingGoogle;
      document.body.appendChild(script);
    } else {
      this.getTokenUsingGoogle();
    }
  }
  render() {
    const { classes } = this.props;
    const LoginButton = useRocheLogin(Button);
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="h5">Sign in</Typography>

            <LoginButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onLoginSuccess={this.props.onLoginSuccess}
              onLoginFailure={this.props.onLoginFailure}
            >
              <img src={GoogleIcon} alt="Google" style={{ marginRight: 20 }} />
              <T.span text="login.googleAuthentication" />
            </LoginButton>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Login);
