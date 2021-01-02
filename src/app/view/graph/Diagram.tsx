import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useZoomPanHelper,
  ReactFlowProvider,
} from "react-flow-renderer";
import { Graph } from "./Graph";

const InnerDiagram: React.FC<{
  graph: Graph;
}> = ({ graph }) => {
  const { fitView } = useZoomPanHelper();
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

export const Diagram: React.FC<{
  graph: Graph;
}> = ({ graph }) => (
  <ReactFlowProvider>
    <InnerDiagram graph={graph} />
  </ReactFlowProvider>
);
