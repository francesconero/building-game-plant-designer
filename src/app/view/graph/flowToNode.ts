import { Node } from "react-flow-renderer";
import invert from "invert-color";
import { ResourceFlow } from "../../domain/Recipe";

export function flowToNode(type: string) {
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
