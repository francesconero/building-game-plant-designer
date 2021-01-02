import { useEffect, useState } from "react";
import { DataProvider, Error as TSXError, useDataProvider } from "react-admin";
import { Edge, Node } from "react-flow-renderer";
import { Recipe } from "../../domain/Recipe";
import { DryRecipe, hydrateRecipe } from "../../persistence/DryRecipe";
import { buildingId, flowToEdge, flowToNode, Graph } from "../graph/Graph";
import GraphField from "../graph/GraphField";

async function buildGraph(dryRecipe: DryRecipe, dataProvider: DataProvider) {
  const recipe = await hydrateRecipe(dryRecipe, dataProvider);
  return recipeToGraph(recipe);
}

export function recipeToGraph(recipe: Recipe) {
  const buildingNode: Node = {
    id: buildingId(recipe.building),
    data: { label: recipe.building.name },
    position: {
      x: 0,
      y: 0,
    },
  };

  const inputNodes = recipe.inputs.map(flowToNode("input"));
  const outputNodes = recipe.outputs.map(flowToNode("output"));
  const inputEdges: Edge[] = recipe.inputs.map(
    flowToEdge(recipe.building, "input")
  );
  const outputEdges: Edge[] = recipe.outputs.map(
    flowToEdge(recipe.building, "output")
  );
  return new Graph(
    [buildingNode, ...inputNodes, ...outputNodes],
    [...inputEdges, ...outputEdges]
  );
}

const RecipeGraph: React.FC<{ dryRecipe?: DryRecipe }> = ({ dryRecipe }) => {
  const dataProvider = useDataProvider();
  const [graph, setGraph] = useState<Graph>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (dryRecipe) {
      buildGraph(dryRecipe, dataProvider)
        .then((newGraph) => {
          setGraph(newGraph);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, [dataProvider, dryRecipe]);
  if (error) return <TSXError error={error} />;
  return <GraphField graph={graph} />;
};

export default RecipeGraph;
