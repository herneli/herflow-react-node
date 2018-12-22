import React, { Component } from "react";
export default function useRocheLogin(WrappedComponent) {
  return class ComponentLogin extends Component {
    constructor(props) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
      this.receiveToken = this.receiveToken.bind(this);
    }

    componentDidMount() {
      window.addEventListener("message", this.receiveToken, false);
    }
    componentWillUnmount() {
      window.removeEventListener("message", this.receiveToken, false);
    }

    receiveToken(event) {
      let origin = process.env.REACT_APP_AUTH_URL.toLowerCase();
      if (event.origin.toLowerCase() === origin) {
        if (event.data.success === true) {
          this.props.onLoginSuccess &&
            this.props.onLoginSuccess(event.data.tokens);
        } else {
          this.props.onLoginFailure && this.props.onLoginFailure(event.data);
        }
      }
    }

    handleLogin() {
      var width = 400;
      var height = 500;
      var left = window.screen.width / 2 - width / 2;
      var top = window.screen.height / 2 - height / 2;
      window.open(
        process.env.REACT_APP_AUTH_URL +
          "/auth/popup?applicationId=" +
          process.env.REACT_APP_APPLICATION_ID,
        "Login",
        `width=${width}, height=${height}, top=${top}, left=${left}`
      );
    }

    render() {
      const {
        onLoginSuccess,
        onLoginFailure,
        ...passThroughProps
      } = this.props;
      return (
        <WrappedComponent {...passThroughProps} onClick={this.handleLogin} />
      );
    }
  };
}
