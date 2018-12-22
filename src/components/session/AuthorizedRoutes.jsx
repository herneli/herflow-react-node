import React, { Component } from "react";
import { connect } from "react-redux";
import T from "i18n-react";
import Initialize from "./Initialize";
import Login from "./Login";
import {
  authenticate,
  resumeAuthentication,
  logout,
  getUserSettings,
  cancelAutoLogin
} from "../../modules/session";
import toaster from "../../services/toaster";

class AuthorizedRoutes extends Component {
  constructor(props) {
    super(props);

    this.handleOnAcceptUseTerms = this.handleOnAcceptUseTerms.bind(this);
    this.handleOnCancelChangePassword = this.handleOnCancelChangePassword.bind(
      this
    );
  }

  componentDidMount = () => {
    this.props.onResumeAuthentication();
  };

  handleOnAcceptUseTerms(value) {
    if (!value) {
      toaster.error(T.translate("AuthorizedRoutes.you_must_accept_use_terms"));
      this.props.onLogout();
    } else {
      this.props.onAcceptUseTerms();
    }
  }

  handleOnCancelChangePassword() {
    if (this.props.mustChangePassword) {
      toaster.error(
        T.translate("AuthorizedRoutes.you_must_change_your_password")
      );
      this.props.onLogout();
    } else {
      this.props.onCancelChangePassword();
    }
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <Login
          tryAutoLogin={this.props.tryAutoLogin}
          onLogin={this.props.onLogin}
          onLoginSuccess={this.props.onLoginSuccess}
          onLoginFailure={this.props.onLoginFailure}
        />
      );
    } else if (!this.props.isInitialized) {
      return <Initialize onInitialize={this.props.onInitialize} />;
    } else {
      return this.props.children;
    }
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.session.isAuthenticated,
    isInitialized: state.session.isInitialized,
    tryAutoLogin: state.session.tryAutoLogin
  };
};

const mapDispatchToProps = dispatch => ({
  onInitialize: () => {
    dispatch(getUserSettings());
  },
  onLogout: () => {
    dispatch(logout());
  },
  onLoginSuccess: tokens => {
    dispatch(authenticate(tokens));
  },
  onLoginFailure: data => {
    dispatch(cancelAutoLogin());
    if (data.errorCode === "EmailNotValid") {
      alert("Cuenta de google selecionada no válida");
    }
  },
  onResumeAuthentication: () => {
    dispatch(resumeAuthentication());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizedRoutes);
