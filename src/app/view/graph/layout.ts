import { Elements, isNode, Position } from "react-flow-renderer";
import dagre from "dagre";

export const getLayoutedElements = (
  elements: Elements,
  direction: "TB" | "LR" = "LR"
) => {
  const dagreGraph = new dagre.graphlib.Graph({ directed: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });
  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: 150, height: 50 });
    } else {
      dagreGraph.setEdge(el.source, el.target, {
        width: el.label ? el.label.length * 10 : 50,
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
};
