import merge from "lodash/merge";
import { createMuiTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const theme = merge({}, defaultTheme, {
  overrides: {
    RaTabbedForm: {
      content: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        "& > span": {
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
        "& > span > .ra-input": {
          display: "contents",
        },
      },
    },
    RaInput: {
      root: {
        backgroundColor: "red",
      },
    },
    RaLink: {
      link: {
        color: defaultTheme.palette.text.primary,
      },
    },
    RaReferenceField: {
      link: {
        color: defaultTheme.palette.text.primary,
      },
    },
  },
});

export default theme;
