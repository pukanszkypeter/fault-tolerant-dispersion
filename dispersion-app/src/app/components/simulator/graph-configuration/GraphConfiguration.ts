export class GraphConfiguration {

  graphType: string;
  nodes: number;
  colors: string[];

  constructor(graphType?: string, nodes?: number, colors?: string[]) {
    this.graphType = graphType;
    this.nodes = nodes;
    this.colors = colors;
  }

  initialize(object: any): GraphConfiguration {
    this.graphType = object.graphType;
    this.nodes = object.nodes;
    this.colors = object.colors;

    return this;
  }

}
