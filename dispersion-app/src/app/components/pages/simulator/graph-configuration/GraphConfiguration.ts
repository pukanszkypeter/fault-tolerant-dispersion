import { GraphType } from "src/app/models/utils/GraphType";

export class GraphConfiguration {
  graphType: GraphType;
  nodes: number;

  constructor(graphType?: GraphType, nodes?: number) {
    this.graphType = graphType;
    this.nodes = nodes;
  }

  initialize(object: any): GraphConfiguration {
    this.graphType = object.graphType;
    this.nodes = object.nodes;

    return this;
  }
}
