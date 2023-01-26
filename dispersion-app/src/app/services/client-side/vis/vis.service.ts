import { Injectable } from '@angular/core';
import * as vis from 'vis-network';
import { DataSet } from 'vis-data/peer/esm/vis-data';
import { VisNode } from 'src/app/models/vis/VisNode';
import { VisEdge } from 'src/app/models/vis/VisEdge';
import { getNodeStateColor } from 'src/app/models/utils/NodeState';
import { Node } from 'src/app/models/core/Node';
import { GeneratorService } from '../../server-side/java-engine/generator-service/generator.service';
import { GraphType } from 'src/app/models/utils/GraphType';
import { InputProps } from 'src/app/models/utils/GraphSettings';
import { delay } from 'rxjs/operators';
import { ThemeService } from '../utils/theme.service';

export function getVisOptions(fontColor: string): any {
  return { 
    nodes: {
      shape: 'dot',
      borderWidth: 1,
      shadow: true,
      font: {
        size: 32,
        color: fontColor,
      },
    },
    edges: {
      width: 1,
    },
    // physics: false,
    interaction: {
      hideEdgesOnDrag: true,
      hideEdgesOnZoom: true,
    }
  }
};

@Injectable({
  providedIn: 'root',
})
export class VisService {

  network: vis.Network;

  nodes: VisNode[];
  edges: VisEdge[];

  constructor(
    private generatorService: GeneratorService,
    private themeService: ThemeService,
    ) {}

  async initGraph(type: GraphType, graphSettings: InputProps, container: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      let network: vis.Network;

      this.initData(type, graphSettings).then(data => {
        this.themeService.theme$.subscribe((theme) => {
          network = new vis.Network(
            container, 
            data, 
            getVisOptions(theme === "dark" ? "white" : "black")
          );
          resolve(true);
        });
      }).catch(error => {
        reject(error);
      }).finally(() => {
        this.network = network;
      });
    });
  }

  async initData(type: GraphType, graphSettings: InputProps): Promise<any> {
    return new Promise((resolve, reject) => {
      let nodes: VisNode[] = [];
      let edges: VisEdge[] = [];

      this.generatorService.generateGraph(type, graphSettings).pipe(delay(500)).subscribe(res => {
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

  destoryGraph(): void {
    this.network.destroy();
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

  getStartNodes(): number[] {
    return this.nodes.map((node) => node.id);
  }

}
