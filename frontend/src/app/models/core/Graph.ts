import { Node } from "./Node";
import { Edge } from "./Edge";

export class Graph<NodeType extends Node, EdgeType extends Edge> {
  nodeList: NodeType[];
  edgeList: EdgeType[];

  constructor(nodeList: NodeType[], edgeList: EdgeType[]) {
    this.nodeList = nodeList;
    this.edgeList = edgeList;
  }
}
