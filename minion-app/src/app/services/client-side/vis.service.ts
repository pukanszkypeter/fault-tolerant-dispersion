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
    return new vis.Network(container, this.initDataFromConfigInANewWay(configuration), options);
  }

  initDataFromConfigInANewWay(configuration: GraphConfiguration): any {
    const colors = configuration.colors;

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let edgeID = 1;
    for (let color of colors) {
      const graph = this.graphGenerator.generateGraph(configuration.graphType, configuration.nodes, 0, '');

      const lines = graph.split('\n');
      for (let line of lines) {
        const chunk = line.split(':');

        // Node
        if (!this.idExist(nodes,Number(chunk[0]))){
          nodes.push(new Node(Number(chunk[0]), chunk[0], chunk.length === 3 ? NodeState.PENDING : NodeState.DEFAULT));
        }

        // Edges
        const toValues = chunk[1].split(',');
        for (let to of toValues) {
          if(!this.isDuplicatedEdge(chunk[0], to, edges)) {
            edges.push(new Edge(edgeID, Number(chunk[0]), Number(to)));
            edgeID++;
          }
        }
      }

      edges.concat(this.colorEdges(edges, color));
    }

    edges = this.dropRandomEdges(edges, colors);
    console.log(edges.length)
    this.nodes = nodes;
    this.edges = edges
    console.log(this.edges.length)
    return {nodes: new DataSet(nodes), edges: new DataSet(edges)};

  }

  /** otlet, dobjunk el random 100%nyi élt az egyes színekből, úgy hogy az induló csúcsokból minden robot legalább eltudjuon indulni. **/

  dropRandomEdges(edges: Edge[], colors: string[]): Edge[] {
    let fixEdges: Edge[] = [];

    for (let i of colors){
      const edgesWithCurrentColor = edges.filter(edge => edge.color === i);
      //TODO eldobjuk az élek 60-100%-t elölről vagy hátulról

      let percentAge = edgesWithCurrentColor.length * 0.6;

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

  idExist(nodes: Node[], id: number): boolean{
    for (let i of nodes){
      if (i.id === id){
        return true;
      }
    }
    return false;
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

  colorEdges(edges: Edge[], color:string): Edge[]{
    let edgesWithNewColor: Edge[] = [];

    for (let edge of edges){
      if (edge.color === undefined ) {
        edge.color = color;
        edgesWithNewColor.push(edge);
      }
    }

    return edgesWithNewColor;
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
