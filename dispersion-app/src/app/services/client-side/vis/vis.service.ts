import { Injectable } from '@angular/core';
import * as vis from 'vis-network';
import { DataSet } from 'vis-data/peer/esm/vis-data';
import { GraphConfiguration } from '../../../components/pages/simulator/graph-configuration/GraphConfiguration';
import { GraphGeneratorService } from '../graph-generator/graph-generator.service';
import { VisNode } from 'src/app/models/vis/VisNode';
import { VisEdge } from 'src/app/models/vis/VisEdge';
import { getNodeStateColor, NodeState } from 'src/app/models/utils/NodeState';
import { Node } from 'src/app/models/core/Node';

@Injectable({
  providedIn: 'root',
})
export class VisService {
  network: vis.Network;

  nodes: VisNode[];
  edges: VisEdge[];

  constructor(private graphGenerator: GraphGeneratorService) {}

  initGraphFromConfig(
    configuration: GraphConfiguration,
    container: HTMLElement,
    options: any
  ): void {
    this.network = new vis.Network(
      container,
      this.initDataFromConfig(configuration),
      options
    );
  }

  initDataFromConfig(configuration: GraphConfiguration): any {
    let nodes: VisNode[] = [];
    let edges: VisEdge[] = [];
    let edgeID = 1;

    const graph = this.graphGenerator.generateGraph(
      configuration.graphType,
      configuration.nodes,
      0,
      ''
    );

    const lines = graph.split('\n');
    for (let line of lines) {
      const chunk = line.split(':');

      // Node
      if (!this.idExist(nodes, Number(chunk[0]))) {
        nodes.push(
          new VisNode(
            Number(chunk[0]),
            chunk[0],
            getNodeStateColor(NodeState.DEFAULT)
          )
        );
      }

      // Edges
      const toValues = chunk[1].split(',');
      for (let to of toValues) {
        if (!this.isDuplicatedEdge(chunk[0], to, edges)) {
          edges.push(
            new VisEdge(edgeID, Number(chunk[0]), Number(to), '#B0B0B0')
          );
          edgeID++;
        }
      }
    }

    this.nodes = nodes;
    this.edges = edges;

    return { nodes: new DataSet(nodes), edges: new DataSet(edges) };
  }

  update(nodes: Node[]): void {
    let visNodes = (this.network as any).nodesHandler.body.data.nodes;
    for (let i = 0; i < nodes.length; i++) {
      visNodes.update({
        id: nodes[i].id,
        label: nodes[i].id.toString(),
        color: getNodeStateColor(nodes[i].state),
      });
    }
  }

  /** Helper Methods */

  isDuplicatedEdge(from: string, to: string, edges: VisEdge[]): boolean {
    return !!edges.find(
      (value) => value.from === Number(to) && value.to === Number(from)
    );
  }

  idExist(nodes: VisNode[], id: number): boolean {
    for (let i of nodes) {
      if (i.id === id) {
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

  getStartNodes(): number[] {
    return this.nodes.map((node) => node.id);
  }
}
