import React, { Component } from "react";
import useRocheLogin from "./useRocheLogin";
import axios from "axios";
import logo from "./img/logo_roche_blue_148x80.png";
import G from "./img/logo_google_white_22x22.png";
import T from "i18n-react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import styles from "./Login.module.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.getTokenUsingGoogle = this.getTokenUsingGoogle.bind(this);
    this.state = { tryingToConnect: false };
  }
  componentDidMount() {
    this.tryToConnectWithGoogleAccount();
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
                      this.setState({ tryingToConnect: false });
                      if (response.data.success) {
                        this.props.onLoginSuccess &&
                          this.props.onLoginSuccess(response.data.tokens);
                      } else {
                        this.props.onLoginFailure &&
                          this.props.onLoginFailure(response.data);
                      }
                    }.bind(this)
                  )
                  .catch(
                    function() {
                      this.setState({ tryingToConnect: false });
                    }.bind(this)
                  );
              } else {
                this.setState({ tryingToConnect: false });
              }
            }.bind(this)
          );
      }.bind(this)
    );
  }

  tryToConnectWithGoogleAccount() {
    this.setState({ tryingToConnect: true });
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
    const LoginButton = useRocheLogin(Button);
    console.log(styles);
    return (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <img src={logo} alt="logo" className="login-logo" />
            </Grid>
            <Grid item xs={12}>
              <h3 style={{ fontWeight: "300" }}>
                <T.span text="login.loginText" />
              </h3>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: "30px" }}>
              <LoginButton
                variant="contained"
                onLoginSuccess={this.props.onLoginSuccess}
                onLoginFailure={this.props.onLoginFailure}
              >
                <img src={G} alt="Google" />
                <T.span text="login.googleAuthentication" />
              </LoginButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
