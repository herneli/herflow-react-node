import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as serviceWorker from "./serviceWorker";
import store, { history } from "store";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import { Flip } from "./styles/Transitions";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./styles/theme";
import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <ToastContainer
            position="bottom-left"
            transition={Flip}
            toastClassName="toast-default"
          />
          <App />
          <CssBaseline />
        </MuiThemeProvider>
      </React.Fragment>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
