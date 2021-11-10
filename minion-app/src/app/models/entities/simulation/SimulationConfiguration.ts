export class SimulationConfiguration {

  algorithmType: string;
  graphType: string;
  nodes: number;
  robots: number;
  colors: number;
  startNodes: number[];

  constructor(algorithmType?: string, graphType?: string, nodes?: number, robots?: number, colors?: number, startNodes?: number[]) {
    this.algorithmType = algorithmType;
    this.graphType = graphType;
    this.nodes = nodes;
    this.robots = robots;
    this.colors = colors;
    this.startNodes = startNodes;
  }

  initialize(object: any): SimulationConfiguration {
    this.algorithmType = object.algorithmType;
    this.graphType = object.graphType;
    this.nodes = object.nodes;
    this.robots = object.robots;
    this.colors = object.colors;
    this.startNodes = object.startNodes;

    return this;
  }

}
