import { Node } from "./Node";
import { Edge } from "./Edge";

export interface Graph<NodeType extends Node, EdgeType extends Edge> {
  nodes: NodeType[];
  edges: EdgeType[];
}
