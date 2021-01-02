import { ReactElement } from "react";
import { Edit, EditProps } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const fullHeightClasses = makeStyles(() => ({
  root: {
    display: "contents",
  },
  main: {
    flexDirection: "column",
    flex: 1,
    "& .tabbed-form": {
      display: "contents",
    },
  },
  card: {
    flex: 1,
    flexDirection: "column",
    display: "flex",
  },
}));

type ExtendedEditProps = EditProps & {
  children: ReactElement;
  fullHeight: boolean;
};

const ExtendedEdit = ({
  fullHeight,
  ...rest
}: ExtendedEditProps): ReactElement => {
  return (
    <Edit classes={fullHeight ? fullHeightClasses() : undefined} {...rest} />
  );
};

ExtendedEdit.propTypes = {
  ...Edit.propTypes,
  fullHeight: PropTypes.bool.isRequired,
};

ExtendedEdit.defaultProps = {
  fullHeight: false,
};

export default ExtendedEdit;
