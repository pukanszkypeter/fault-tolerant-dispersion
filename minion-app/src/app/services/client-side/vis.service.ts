import {Injectable} from '@angular/core';
import * as vis from 'vis-network';
import { DataSet } from "vis-data/peer/esm/vis-data"
import {Node} from "../../models/entities/vis/Node";
import {Edge} from "../../models/entities/vis/Edge";
import {NodeState} from "../../models/entities/algorithms/states/NodeState";
import {GraphConfiguration} from "../../models/entities/simulator/GraphConfiguration";
import {GraphGeneratorService} from "./graphs/graph-generator.service";

@Injectable({
  providedIn: 'root'
})
export class VisService {

  nodes: Node[];
  edges: Edge[];

  constructor(private graphGenerator: GraphGeneratorService) { }

  initGraphFromConfig(configuration: GraphConfiguration, container: HTMLElement, options: any): vis.Network {
    return new vis.Network(container, this.initDataFromConfig(configuration), options);
  }

  initDataFromConfig(configuration: GraphConfiguration): any {
    const graph = this.graphGenerator.generateGraph(configuration.graphType, configuration.nodes, 0, '');
    const colors = configuration.colors;

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let edgeID = 1;

    const lines = graph.split('\n');
    for (let line of lines) {
      const chunk = line.split(':');

      // Node
      nodes.push(new Node(Number(chunk[0]), chunk[0], chunk.length === 3 ? NodeState.PENDING : NodeState.DEFAULT));

      // Edges
      const toValues = chunk[1].split(',');
      for (let to of toValues) {
        if(!this.isDuplicatedEdge(chunk[0], to, edges)) {
          edges.push(new Edge(edgeID, Number(chunk[0]), Number(to)));
          edgeID++;
        }
      }
    }

    // Coloring
    edges = this.colorEdgesEqually(edges, colors);

    this.nodes = nodes;
    this.edges = edges;

    return {nodes: new DataSet(nodes), edges: new DataSet(edges)};
  }

  /** Helper Methods */

  isDuplicatedEdge(from: string, to: string, edges: Edge[]): boolean {
    return !!edges.find(value => value.from === Number(to) && value.to === Number(from));
  }

  colorEdgesEqually(edges: Edge[], colors: string[]): Edge[] {
    const distribution = this.balance(edges.length, colors.length);
    let tmp: Edge[] = [];


    for (let i = 0; i < distribution.length; i++) {
      for (let j = 0; j < distribution[i]; j++) {
        const edge = edges.shift();
        edge.color = colors[i];
        tmp.push(edge);
      }
    }

    return tmp;
  }

  balance(x: number, y: number): number[] {
    let mod = x % y;
    const balance = (x - mod) / y;

    let list = [];
    for (let i = 0; i < y; i++) {
      mod === 0 ? list.push(balance) : list.push(balance + 1);
      if (mod > 0) {
        mod--;
      }
    }

    return list;
  }

  /** Getters */

  getStartNodes(): Map<string, number[]> {
    let startNodes = new Map<string, number[]>();

    for (let i = 0; i < this.edges.length; i++) {
      const color = this.edges[i].color;
      const from = this.edges[i].from;
      const to = this.edges[i].to;
      !startNodes.has(color) ? startNodes.set(color, [from, to]) : startNodes.get(color).push(from, to);
    }

    for (let [key, values] of startNodes) {
      values = [...new Set(values)]; // because of distinct
      startNodes.set(key, values);
    }

    return startNodes;
  }

}
