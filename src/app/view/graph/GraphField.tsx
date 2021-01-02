import { FieldProps, Loading } from "react-admin";
import { Diagram } from "./Diagram";
import { Graph } from "./Graph";
import { makeStyles } from "@material-ui/core/styles";

export const useLoadingStyles = makeStyles({
  container: {
    height: "auto",
    marginTop: 0,
    flex: 1,
  },
});

const GraphField: React.FC<FieldProps & { graph?: Graph }> = ({ graph }) => {
  const loadingClasses = useLoadingStyles();
  if (!graph) {
    return <Loading classes={loadingClasses} />;
  } else return <Diagram graph={graph} />;
};

export default GraphField;
