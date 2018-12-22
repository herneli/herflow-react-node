import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0070ba"
    },
    background: {
      default: "#e8e8e8"
    }
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiInput: {
      underline: {
        "&:hover:before": {
          borderBottomWidth: 1
        },
        "&:after": {
          borderBottomWidth: 1
        }
      }
    }
  }
});
export default theme;
