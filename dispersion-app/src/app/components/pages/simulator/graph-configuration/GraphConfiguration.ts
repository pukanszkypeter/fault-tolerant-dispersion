export class GraphConfiguration {
  graphType: string;
  nodes: number;

  constructor(graphType?: string, nodes?: number) {
    this.graphType = graphType;
    this.nodes = nodes;
  }

  initialize(object: any): GraphConfiguration {
    this.graphType = object.graphType;
    this.nodes = object.nodes;

    return this;
  }
}
