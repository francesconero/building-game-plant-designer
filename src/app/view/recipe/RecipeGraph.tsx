import {
  DataProvider,
  Error as TSXError,
  Loading,
  useDataProvider,
} from "react-admin";
import { useState, useEffect } from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import { DryRecipe, hydrateRecipe } from "../../persistence/DryRecipe";
import { useLoadingStyles } from "./loadingStyles";
import { Diagram } from "../graph/Diagram";
import { buildingId, flowToEdge, flowToNode, Graph } from "../graph/Graph";
import { Recipe } from "../../domain/Recipe";
import { Node, Edge } from "react-flow-renderer";

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

const RecipeGraphInner: React.FC<{ dryRecipe?: DryRecipe }> = ({
  dryRecipe,
}) => {
  const loadingClasses = useLoadingStyles();
  const dataProvider = useDataProvider();
  const [graph, setGraph] = useState<Graph>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (dryRecipe) {
      buildGraph(dryRecipe, dataProvider)
        .then((newGraph) => {
          setGraph(newGraph);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [dataProvider, dryRecipe]);

  if (loading) return <Loading classes={loadingClasses} />;
  if (error) return <TSXError error={error} />;
  if (!graph) return null;
  return <Diagram graph={graph} />;
};

const RecipeGraph: React.FC<{ dryRecipe?: DryRecipe }> = ({ dryRecipe }) => (
  <ReactFlowProvider>
    <RecipeGraphInner dryRecipe={dryRecipe} />
  </ReactFlowProvider>
);

export default RecipeGraph;
