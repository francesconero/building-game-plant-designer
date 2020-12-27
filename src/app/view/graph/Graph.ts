import { Node, Edge, ArrowHeadType } from "react-flow-renderer";
import { isNode, Position } from "react-flow-renderer";
import dagre from "dagre";
import { ResourceFlow } from "../../domain/Recipe";
import invert from "invert-color";
import { Building } from "../../domain/Building";

export type FlowDirection = "input" | "output";

export class Graph {
  constructor(readonly nodes: Node[], readonly edges: Edge[]) {}

  getElements() {
    return [...this.nodes, ...this.edges];
  }

  getLayoutedElements(direction: "TB" | "LR" = "LR") {
    const elements = this.getElements();
    const dagreGraph = new dagre.graphlib.Graph({ directed: true });
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });
    elements.forEach((el) => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: 150, height: 50 });
      } else {
        dagreGraph.setEdge(el.source, el.target, {
          width: el.label ? el.label.length * 5 + 20 : 50,
          height: 50,
        });
      }
    });
    dagre.layout(dagreGraph);
    return elements.map((el) => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = isHorizontal ? Position.Left : Position.Top;
        el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
        el.position = {
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
        };
      }
      return el;
    });
  }
}

export function flowNodeId(flowDirection: string, flow: ResourceFlow): string {
  return `${flowDirection}_${flow.resource.id}`;
}

export function buildingId(building: Building): string {
  return `building_${building.id}`;
}

export function flowEdgeId(
  flowDirection: string,
  flow: ResourceFlow,
  building: Building
): string {
  return flowDirection === "input"
    ? `${flow.resource.id}->${building.id}`
    : `${building.id}->${flow.resource.id}`;
}

export function flowToEdge(building: Building, flowDirection: FlowDirection) {
  return (flow: ResourceFlow): Edge => ({
    id: flowEdgeId(flowDirection, flow, building),
    source:
      flowDirection === "input"
        ? flowNodeId(flowDirection, flow)
        : buildingId(building),
    target:
      flowDirection === "input"
        ? buildingId(building)
        : flowNodeId(flowDirection, flow),
    label: `${flow.flowRate}`,
    animated: true,
    type: "smoothstep",
    arrowHeadType: ArrowHeadType.Arrow,
  });
}

export function flowToNode(flowDirection: FlowDirection) {
  return (flow: ResourceFlow) => ({
    id: flowNodeId(flowDirection, flow),
    data: { label: flow.resource.name, flow: flow },
    position: {
      x: 0,
      y: 0,
    },
    type: flowDirection,
    style: {
      backgroundColor: flow.resource.color,
      borderColor: invert(flow.resource.color),
      color: invert(flow.resource.color, true),
    },
  });
}
