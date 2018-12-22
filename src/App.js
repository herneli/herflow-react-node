import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import T from "i18n-react";
import AuthorizedRoutes from "./components/session/AuthorizedRoutes";
import NotFound from "./scenes/404/NotFound";
import Layout from "./scenes/Layout";
import moment from "moment";
import "moment/locale/es";
import { toggleLanguage } from "./modules/session";
import Workflow from "./scenes/Workflow";
import Test from "./test";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    if (state.language !== props.language) {
      T.setTexts(require("i18n/texts-" + props.language + ".json"));
      moment.locale(props.language);
      return { language: props.language };
    } else {
      return null;
    }
  }

  render() {
    return (
      <Switch>
        <Redirect exact path="/" to="/test" />
        <Route path="/404" component={NotFound} />
        <Route path="/workflow" component={Workflow} />
        <Route path="/test" component={Test} />
        <AuthorizedRoutes>
          <Switch>
            <Layout />
            <Redirect path="*" to="/404" />
          </Switch>
        </AuthorizedRoutes>
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  language: state.session.language
});

const mapDispatchToProps = dispatch => ({
  onToggleLanguage: () => {
    dispatch(toggleLanguage());
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
