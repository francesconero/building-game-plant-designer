import { Error as TSXError, Loading, useDataProvider } from "react-admin";
import { useState, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  ArrowHeadType,
  useZoomPanHelper,
  ReactFlowProvider,
} from "react-flow-renderer";
import { DryBuilding } from "../../persistence/DryBuilding";
import { DryRecipe } from "../../persistence/DryRecipe";
import { DryResource } from "../../persistence/DryResource";
import _ from "lodash";
import { ResourceFlow } from "../../domain/Recipe";
import { makeStyles } from "@material-ui/core/styles";
import { Graph } from "../graph/Graph";
import { flowToNode } from "../graph/flowToNode";
import { hydrateFlow } from "./hydrateFlow";

const useStylesLoading = makeStyles({
  container: {
    height: "auto",
    marginTop: 0,
    flex: 1,
  },
});

const RecipeGraphInner: React.FC<{ dryRecipe?: DryRecipe }> = ({
  dryRecipe,
}) => {
  const loadingClasses = useStylesLoading();
  const dataProvider = useDataProvider();
  const [graph, setGraph] = useState<Graph>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const { fitView } = useZoomPanHelper();
  useEffect(() => {
    if (dryRecipe) {
      Promise.all([
        dataProvider.getOne<DryBuilding>("buildings", {
          id: dryRecipe.building,
        }),
        dataProvider.getMany<DryResource>("resources", {
          ids: dryRecipe.inputs
            .filter(_.negate(_.isNil))
            .map((input) => input.resource),
        }),
        dataProvider.getMany<DryResource>("resources", {
          ids: dryRecipe.outputs
            .filter(_.negate(_.isNil))
            .map((output) => output.resource),
        }),
      ])
        .then(
          ([
            { data: dryBuilding },
            { data: inputResources },
            { data: outputResources },
          ]) => {
            const inputResourceFlows: ResourceFlow[] = dryRecipe.inputs
              .filter((dryFlow) => dryFlow?.resource)
              .map((dryFlow) => hydrateFlow(dryFlow, inputResources));
            const outputResourceFlows: ResourceFlow[] = dryRecipe.outputs
              .filter((dryFlow) => dryFlow?.resource)
              .map((dryFlow) => hydrateFlow(dryFlow, outputResources));
            const buildingNode: Node = {
              id: `building_${dryBuilding.id}`,
              data: { label: dryBuilding.name },
              position: {
                x: 0,
                y: 0,
              },
            };
            const inputNodes = inputResourceFlows.map(flowToNode("input"));
            const outputNodes = outputResourceFlows.map(flowToNode("output"));
            const inputEdges: Edge[] = inputNodes.map((inputNode) => ({
              id: `${inputNode.id}->${buildingNode.id}`,
              source: inputNode.id,
              target: buildingNode.id,
              label: inputNode.data && `${inputNode.data.flow.flowRate}`,
              animated: true,
              type: "smoothstep",
              arrowHeadType: ArrowHeadType.Arrow,
            }));
            const outputEdges: Edge[] = outputNodes.map((outputNode) => ({
              id: `${buildingNode.id}->${outputNode.id}`,
              source: buildingNode.id,
              target: outputNode.id,
              label: outputNode.data && `${outputNode.data.flow.flowRate}`,
              animated: true,
              type: "smoothstep",
              arrowHeadType: ArrowHeadType.Arrow,
            }));
            const newGraph = new Graph(
              [buildingNode, ...inputNodes, ...outputNodes],
              [...inputEdges, ...outputEdges]
            );
            setGraph(newGraph);
            setLoading(false);
          }
        )
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [dataProvider, dryRecipe, fitView]);

  if (loading) return <Loading classes={loadingClasses} />;
  if (error) return <TSXError error={error} />;
  if (!graph) return null;
  return (
    <ReactFlow
      maxZoom={10}
      onLoad={() => fitView()}
      snapToGrid={true}
      nodesConnectable={false}
      nodesDraggable={true}
      elementsSelectable={false}
      elements={graph.getLayoutedElements()}
    >
      <Controls showInteractive={false} />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};

const RecipeGraph: React.FC<{ dryRecipe?: DryRecipe }> = ({ dryRecipe }) => (
  <ReactFlowProvider>
    <RecipeGraphInner dryRecipe={dryRecipe} />
  </ReactFlowProvider>
);

export default RecipeGraph;
