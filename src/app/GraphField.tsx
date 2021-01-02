import { FieldProps } from "react-admin";
import { useFormState } from "react-final-form";
import { DryRecipe } from "./persistence/DryRecipe";
import RecipeGraph from "./view/recipe/RecipeGraph";

const GraphField: React.FC<FieldProps> = () => {
  const dryRecipe = useFormState().values as DryRecipe | undefined;
  return <RecipeGraph dryRecipe={dryRecipe} />;
};

export default GraphField;
