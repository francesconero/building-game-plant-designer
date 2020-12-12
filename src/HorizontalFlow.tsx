import React, { useState, MouseEvent } from "react";
import ReactFlow, {
  removeElements,
  addEdge,
  OnLoadFunc,
  Node,
  Elements,
  Position,
  Edge,
  Connection,
} from "react-flow-renderer";

type NodeMouseEventFunc = (event: MouseEvent, node: Node) => void;
type ConnectionCallback = (connection: Edge | Connection) => void;
type ElementsCallback = (elements: Elements) => void;

const onLoad: OnLoadFunc = (reactFlowInstance) => reactFlowInstance.fitView();
const onNodeMouseEnter: NodeMouseEventFunc = (event, node) =>
  console.log("mouse enter:", node);
const onNodeMouseMove: NodeMouseEventFunc = (event, node) =>
  console.log("mouse move:", node);
const onNodeMouseLeave: NodeMouseEventFunc = (event, node) =>
  console.log("mouse leave:", node);
const onNodeContextMenu: NodeMouseEventFunc = (event, node) => {
  event.preventDefault();
  console.log("context menu:", node);
};
const initialElements: Elements = [
  {
    id: "horizontal-1",
    sourcePosition: Position.Left,
    type: "input",
    className: "dark-node",
    data: { label: "Input" },
    position: { x: 0, y: 80 },
  },
  {
    id: "horizontal-2",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "A Node" },
    position: { x: 250, y: 0 },
  },
  {
    id: "horizontal-e1-2",
    source: "horizontal-1",
    type: "smoothstep",
    target: "horizontal-2",
    animated: true,
  },
  {
    id: "horizontal-e1-3",
    source: "horizontal-1",
    type: "smoothstep",
    target: "horizontal-3",
    animated: true,
  },
  {
    id: "horizontal-e1-4",
    source: "horizontal-2",
    type: "smoothstep",
    target: "horizontal-4",
    label: "edge label",
  },
  {
    id: "horizontal-e3-5",
    source: "horizontal-3",
    type: "smoothstep",
    target: "horizontal-5",
    animated: true,
  },
  {
    id: "horizontal-e3-6",
    source: "horizontal-3",
    type: "smoothstep",
    target: "horizontal-6",
    animated: true,
  },
  {
    id: "horizontal-e5-7",
    source: "horizontal-5",
    type: "smoothstep",
    target: "horizontal-7",
    animated: true,
  },
  {
    id: "horizontal-e6-8",
    source: "horizontal-6",
    type: "smoothstep",
    target: "horizontal-8",
    animated: true,
  },
];
const HorizontalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove: ElementsCallback = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect: ConnectionCallback = (params) =>
    setElements((els) => addEdge(params, els));
  const changeClassName = () => {
    setElements((elms) =>
      elms.map((el) => {
        if (el.type === "input") {
          el.className = el.className ? "" : "dark-node";
        }
        return { ...el };
      })
    );
  };
  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      selectNodesOnDrag={false}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseMove={onNodeMouseMove}
      onNodeMouseLeave={onNodeMouseLeave}
      onNodeContextMenu={onNodeContextMenu}
    >
      <button
        onClick={changeClassName}
        style={{ position: "absolute", right: 10, top: 30, zIndex: 4 }}
      >
        change class name
      </button>
    </ReactFlow>
  );
};
export default HorizontalFlow;
