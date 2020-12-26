import { Error as TSXError, Loading, useDataProvider } from "react-admin";
import { useState, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  OnLoadParams,
  ArrowHeadType,
} from "react-flow-renderer";
import { DryBuilding } from "../../persistence/DryBuilding";
import { DryRecipe, DryResourceFlow } from "../../persistence/DryRecipe";
import { DryResource } from "../../persistence/DryResource";
import _ from "lodash";
import invert from "invert-color";
import { ResourceFlow } from "../../domain/Recipe";
import { Resource } from "../../domain/Resource";
import { getLayoutedElements } from "../graph/layout";

function hydrateFlow(dryFlow: DryResourceFlow, resources: Resource[]) {
  const hydratedResource = resources.find(
    (resource) => resource.id === dryFlow.resource
  );
  if (!hydratedResource) {
    throw new Error(`missing resource ${dryFlow.resource}`);
  }
  return {
    ...dryFlow,
    resource: hydratedResource,
  };
}

function flowToNode(type: string) {
  return (flow: ResourceFlow) => {
    const node: Node = {
      id: `input_${flow.resource.id}`,
      data: { label: flow.resource.name, flow: flow },
      position: {
        x: 0,
        y: 0,
      },
      type: type,
      style: {
        backgroundColor: flow.resource.color,
        borderColor: invert(flow.resource.color),
        color: invert(flow.resource.color, true),
      },
    };
    return node;
  };
}

export class Graph {
  constructor(readonly nodes: Node[], readonly edges: Edge[]) {}
  getLayoutedElements() {
    return getLayoutedElements([...this.nodes, ...this.edges]);
  }
}

const onLoad = (reactFlowInstance: OnLoadParams) => {
  reactFlowInstance.fitView();
};

const RecipeGraph: React.FC<{ dryRecipe?: DryRecipe }> = ({ dryRecipe }) => {
  const dataProvider = useDataProvider();
  const [graph, setGraph] = useState<Graph>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
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
  }, [dataProvider, dryRecipe]);

  if (loading) return <Loading />;
  if (error) return <TSXError error={error} />;
  if (!graph) return null;
  return (
    <div style={{ position: "relative", height: 500, width: "100%" }}>
      <ReactFlow
        maxZoom={3}
        onLoad={onLoad}
        snapToGrid={true}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={false}
        elements={graph.getLayoutedElements()}
      >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default RecipeGraph;
