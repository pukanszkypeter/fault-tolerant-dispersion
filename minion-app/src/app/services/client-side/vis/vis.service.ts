import {Injectable} from '@angular/core';
import * as vis from 'vis-network';
import {DataSet} from "vis-data/peer/esm/vis-data"
import {Node, VisNode} from "../../../models/entities/Node";
import {VisEdge} from "../../../models/entities/Edge";
import {NodeState} from "../../../models/entities/Node";
import {GraphConfiguration} from "../../../components/simulator/graph-configuration/GraphConfiguration";
import {GraphGeneratorService} from "../graph-generator/graph-generator.service";

@Injectable({
  providedIn: 'root'
})
export class VisService {

  network: vis.Network;

  nodes: VisNode[];
  edges: VisEdge[];

  constructor(private graphGenerator: GraphGeneratorService) { }

  initGraphFromConfig(configuration: GraphConfiguration, container: HTMLElement, options: any): void {
    this.network = new vis.Network(container, this.initDataFromConfig(configuration), options);
  }

  initDataFromConfig(configuration: GraphConfiguration): any {
    const colors = configuration.colors;

    let nodes: VisNode[] = [];
    let edges: VisEdge[] = [];
    let edgeID = 1;
    for (let color of colors) {
      const graph = this.graphGenerator.generateGraph(configuration.graphType, configuration.nodes, 0, '');

      const lines = graph.split('\n');
      for (let line of lines) {
        const chunk = line.split(':');

        // Node
        if (!this.idExist(nodes, Number(chunk[0]))){
          nodes.push(new VisNode(Number(chunk[0]), chunk[0], NodeState.DEFAULT));
        }

        // Edges
        const toValues = chunk[1].split(',');
        for (let to of toValues) {
          if(!this.isDuplicatedEdge(chunk[0], to, edges)) {
            edges.push(new VisEdge(edgeID, Number(chunk[0]), Number(to)));
            edgeID++;
          }
        }
      }

      edges.concat(this.colorEdges(edges, color));
    }

    edges = this.dropRandomEdges(edges, colors);
    this.nodes = nodes;
    this.edges = edges

    return {nodes: new DataSet(nodes), edges: new DataSet(edges)};
  }

  dropRandomEdges(edges: VisEdge[], colors: string[]): VisEdge[] {
    let fixEdges: VisEdge[] = [];

    for (let i of colors){
      const edgesWithCurrentColor = edges.filter(edge => edge.color === i);

      // Drop 60-100% of edges from front and back
      let percentAge = edgesWithCurrentColor.length * 0.7;

      let dropElementsAfter = Math.floor(Math.random() * (edgesWithCurrentColor.length - percentAge + 1)) + percentAge;

      let front = Math.floor(Math.random() * (1 + 1));
      if (front === 1){
        for (let j = 0; j < edgesWithCurrentColor.length-1; j++ ) {
          if (j <= dropElementsAfter) {
            fixEdges.push(edgesWithCurrentColor[j])
          }
        }
      }else {
        let counter = 0;
        for (let j = edgesWithCurrentColor.length-1; j > 0; j-- ) {
          if (counter <= dropElementsAfter) {
            fixEdges.push(edgesWithCurrentColor[j])
          }
          counter++;
        }
      }
    }

    return fixEdges;
  }

  update(nodes: Node[]): void {
    let visNodes = (this.network as any).nodesHandler.body.data.nodes;
    for (let i = 0; i < nodes.length; i++) {
      visNodes.update({id: nodes[i].id, label: nodes[i].id.toString(), color: nodes[i].state});
    }
  }

  /** Helper Methods */

  isDuplicatedEdge(from: string, to: string, edges: VisEdge[]): boolean {
    return !!edges.find(value => value.from === Number(to) && value.to === Number(from));
  }

  colorEdges(edges: VisEdge[], color:string): VisEdge[]{
    let edgesWithNewColor: VisEdge[] = [];

    for (let edge of edges){
      if (edge.color === undefined ) {
        edge.color = color;
        edgesWithNewColor.push(edge);
      }
    }

    return edgesWithNewColor;
  }

  idExist(nodes: VisNode[], id: number): boolean{
    for (let i of nodes){
      if (i.id === id){
        return true;
      }
    }
    return false;
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
      values = [...new Set(values)].sort(function(a, b){return a - b}); // because of distinct
      startNodes.set(key, values);
    }

    return startNodes;
  }

}
