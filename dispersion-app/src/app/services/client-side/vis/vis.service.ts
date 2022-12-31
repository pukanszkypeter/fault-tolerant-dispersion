import { Injectable } from '@angular/core';
import * as vis from 'vis-network';
import { DataSet } from 'vis-data/peer/esm/vis-data';
import { GraphConfiguration } from '../../../components/pages/simulator/graph-configuration/GraphConfiguration';
import { GraphGeneratorService } from '../graph-generator/graph-generator.service';
import { VisNode } from 'src/app/models/vis/VisNode';
import { VisEdge } from 'src/app/models/vis/VisEdge';
import { getNodeStateColor, NodeState } from 'src/app/models/utils/NodeState';
import { Node } from 'src/app/models/core/Node';
import { GeneratorService } from '../../server-side/java-engine/generator-service/generator.service';

@Injectable({
  providedIn: 'root',
})
export class VisService {
  network: vis.Network;

  nodes: VisNode[];
  edges: VisEdge[];

  constructor(private graphGenerator: GraphGeneratorService, private generatorService: GeneratorService) {}

  initGraphFromConfig(
    configuration: GraphConfiguration,
    container: HTMLElement,
    options: any
  ): void {

    let network: vis.Network;

    this.initDataFromConfig(configuration).then(data => {
      network = new vis.Network(container, data, options);
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      this.network = network;
    });
  }

  async initDataFromConfig(configuration: GraphConfiguration): Promise<any> {
    return new Promise((resolve, reject) => {
      let nodes: VisNode[] = [];
      let edges: VisEdge[] = [];

      this.generatorService.generateGraph(configuration.graphType, configuration.nodes).subscribe(res => {
        for (let node of res.nodeList) {
          nodes.push(new VisNode(node.id, node.id.toString(), getNodeStateColor(node.state)));
        }
        for (let edge of res.edgeList) {
          edges.push(new VisEdge(edge.id, edge.fromID, edge.toID, "#B0B0B0"));
        }

        this.nodes = nodes;
        this.edges = edges;

        resolve({ nodes: new DataSet(nodes), edges: new DataSet(edges) });
      }, err => {
        reject(err);
      });
    });
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
