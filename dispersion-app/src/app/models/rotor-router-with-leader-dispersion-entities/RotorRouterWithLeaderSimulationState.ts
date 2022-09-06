import {RotorRouterDispersionNode} from "../rotor-router-dispersion-entities/RotorRouterDispersionNode";
import {RotorRouterWithLeaderRobot} from "./RotorRouterWithLeaderRobot";
import {Edge, VisEdge} from "../base-entities/Edge";
import {NodeState, VisNode} from "../base-entities/Node";

export class RotorRouterWithLeaderSimulationState {

  nodes: RotorRouterDispersionNode[] | any[];
  edges: Edge[];
  robots: RotorRouterWithLeaderRobot[];
  counter: number;

  init(object: any): RotorRouterWithLeaderSimulationState {
    this.nodes = object.nodes.map((node: any) => new Object({id: node.id, state: this.nodeStateConverter(node.state), currentComponentPointer: node.currentComponentPointer }));
    this.edges = object.edges.map((edge: any) => new Object({id: edge.id, fromID: edge.fromID, toID: edge.toID, color: this.colorConverter(edge.color)}));
    this.robots = object.robots.map((robot: any) => new Object({id: robot.id, onID: robot.onID, state: robot.state, color: this.colorConverter(robot.color), lastEdgeID: robot.lastEdgeID}));
    this.counter = object.counter;
    return this;
  }

  initialize(nodes: VisNode[], edges: VisEdge[], robots: RotorRouterWithLeaderRobot[]): RotorRouterWithLeaderSimulationState {
    this.nodes = nodes.map(node => new RotorRouterDispersionNode(node.id, node.color as NodeState));
    this.edges = edges.map(edge => new Edge(edge.id, edge.from, edge.to, edge.color));
    this.robots = robots;
    this.counter = robots.length;

    this.nodes
      .filter(node => [...new Set(robots.map(robot => robot.onID))].includes(node.id))
      .forEach(node => node.state = NodeState.PENDING); // update start nodes

    return this;
  }

  converter(simulationState: RotorRouterWithLeaderSimulationState): any {
    return {
      nodes: simulationState.nodes.map(node => new Object({id: node.id, state: this.nodeStateConverter(node.state), currentComponentPointer: node.currentComponentPointer})),
      edges: simulationState.edges.map(edge => new Object({id: edge.id, fromID: edge.fromID, toID: edge.toID, color: this.colorConverter(edge.color)})),
      robots: simulationState.robots.map(robot => new Object({id: robot.id, onID: robot.onID, state: robot.state, color: this.colorConverter(robot.color), lastEdgeID: robot.lastEdgeID})),
      counter: simulationState.counter
    };
  }

  nodeStateConverter(nodeState: string): NodeState {
    switch (nodeState) {
      case 'DEFAULT':
        return NodeState.DEFAULT;
      case 'PENDING':
        return NodeState.PENDING;
      case 'OCCUPIED':
        return NodeState.OCCUPIED;
    }
  }

  colorConverter(color: string): string {
    switch (color) {
      case 'BLACK':
        return '#000000';
      case 'GREEN':
        return '#003300';
      case 'GREY':
        return '#666666';
      case 'BROWN':
        return '#663300';
      case 'ORANGE':
        return '#ff9900';
      case 'YELLOW':
        return '#ffff00';
      case 'PINK':
        return '#ff33cc';
      case 'PURPLE':
        return '#9900cc';
      case 'BLUE':
        return '#0000ff';
      case 'AQUA':
        return '#00ffff';
    }
  }

}
