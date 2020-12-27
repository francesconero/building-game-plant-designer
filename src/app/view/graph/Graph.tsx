import { Node, Edge } from "react-flow-renderer";
import { getLayoutedElements } from "./layout";

export class Graph {
  constructor(readonly nodes: Node[], readonly edges: Edge[]) {}
  getLayoutedElements() {
    return getLayoutedElements([...this.nodes, ...this.edges]);
  }
}
