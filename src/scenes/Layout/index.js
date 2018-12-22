import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Grid from "@material-ui/core/Grid";
import T from "i18n-react";
import logo from "../../components/img/logo_white.png";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  title: {
    marginRight: 10
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  layoutContainer: {
    marginTop: 80
  }
};
class Layout extends Component {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon onClick={this.props.onToggleLanguage} />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow} />
            <Typography variant="h6" color="inherit" className={classes.title}>
              {T.translate("title")}
            </Typography>

            <img src={logo} alt="logo" />
          </Toolbar>
        </AppBar>
        <Grid className={classes.layoutContainer} container>
          {this.props.children}
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Layout);
