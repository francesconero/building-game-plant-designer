import { defaultTheme } from "react-admin";
import merge from "lodash/merge";
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
  },
});

export default theme;
