import {Injectable} from '@angular/core';
import * as vis from 'vis-network';
import { DataSet } from "vis-data/peer/esm/vis-data"
import {Node} from "../../models/entities/vis/Node";
import {Edge} from "../../models/entities/vis/Edge";
import {NodeState} from "../../models/entities/graph/GraphState";
import {SimulationConfiguration} from "../../models/entities/simulation/SimulationConfiguration";
import {GraphGeneratorService} from "./graphs/graph-generator.service";
import {getRandomColors} from "../../models/others/Colors";

@Injectable({
  providedIn: 'root'
})
export class VisService {

  constructor(private graphGenerator: GraphGeneratorService) { }

  initGraphFromConfig(configuration: SimulationConfiguration, container: HTMLElement, options: any): vis.Network {
    return new vis.Network(container, this.initDataFromConfig(configuration), options);
  }

  initDataFromConfig(configuration: SimulationConfiguration): any {
    const graph = this.graphGenerator.generateGraph(configuration.graphType, configuration.nodes, configuration.robots, configuration.startNodes.toString());
    const colors = getRandomColors(configuration.colors);

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
          edges.push(new Edge(edgeID, Number(chunk[0]), Number(to), colors[Math.floor(Math.random() * colors.length)].hex));
          edgeID++;
        }
      }

    }

    return {nodes: new DataSet(nodes), edges: new DataSet(edges)};
  }

  isDuplicatedEdge(from: string, to: string, edges: Edge[]): boolean {
    return !!edges.find(value => value.from === Number(to) && value.to === Number(from));
  }

}
