import {Edge, VisEdge} from "./Edge";
import {Node, NodeState, VisNode} from "./Node"
import {Robot} from "./Robot";

export class SimulationState {

  nodes: Node[];
  edges: Edge[];
  robots: Robot[];
  counter: number;

  init(object: any): SimulationState {
    this.nodes = object.nodes;
    this.edges = object.edges;
    this.robots = object.robots;
    this.counter = object.counter;
    return this;
  }

  initialize(nodes: VisNode[], edges: VisEdge[], robots: Robot[]): SimulationState {
    this.nodes = nodes.map(node => new Node(node.id, node.color as NodeState));
    this.edges = edges.map(edge => new Edge(edge.id, edge.from, edge.to, edge.color));
    this.robots = robots;
    this.counter = nodes.length;

    this.nodes
      .filter(node => [...new Set(robots.map(robot => robot.onID))].includes(node.id))
      .forEach(node => node.state = NodeState.PENDING); // update start nodes

    return this;
  }

}
