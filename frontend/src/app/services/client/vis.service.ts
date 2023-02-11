import { Injectable } from "@angular/core";
import * as vis from "vis-network";
import { VisNode } from "src/app/models/vis/VisNode";
import { VisEdge } from "src/app/models/vis/VisEdge";
import { delay, map } from "rxjs/operators";
import { GraphService } from "../server/graph.service";
import { DarkModeService } from "angular-dark-mode";
import { GraphType } from "src/app/models/graph/GraphType";
import { Observable, zip } from "rxjs";
import { getNodeStateColor } from "src/app/models/graph/NodeState";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { Node } from "src/app/models/graph/Node";
import { Edge } from "src/app/models/graph/Edge";

@Injectable({
  providedIn: "root",
})
export class VisService {
  network: vis.Network | undefined;

  nodes: Node[] = [];
  visNodes: DataSet<VisNode, "id"> | undefined;
  edges: Edge[] = [];
  visEdges: DataSet<VisEdge, "id"> | undefined;

  options: vis.Options | undefined;

  constructor(private graph: GraphService, private darkMode: DarkModeService) {}

  public drawGraph(
    type: GraphType,
    props: { key: string; value: any }[],
    container: HTMLElement
  ): Observable<void> {
    return zip(this.graph.generate(type, props), this.darkMode.darkMode$).pipe(
      delay(500),
      map((response) => {
        const graph = response[0];
        const darkMode = response[1];

        this.visNodes = new DataSet(
          graph.nodes.map((node) => {
            this.nodes.push(node);
            return {
              id: node.id,
              label: node.id.toString(),
              color: getNodeStateColor(node.state, darkMode),
            } as VisNode;
          })
        );

        this.visEdges = new DataSet(
          graph.edges.map((edge) => {
            this.edges.push(edge);
            return {
              id: edge.id,
              from: edge.fromId,
              to: edge.toId,
              color: darkMode ? "#ffffff" : "#000000",
            } as VisEdge;
          })
        );

        this.options = {
          nodes: {
            shape: "dot",
            borderWidth: 1,
            shadow: true,
            font: {
              size: 32,
              color: darkMode ? "#ffffff" : "#000000",
            },
          },
          edges: {
            width: 1,
          },
          // physics: false,
          interaction: {
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
          },
        };

        this.network = new vis.Network(
          container,
          {
            nodes: this.visNodes,
            edges: this.visEdges,
          },
          this.options
        );
      })
    );
  }

  public changeColorMode(darkMode: boolean): void {
    this.nodes.forEach((node) => {
      this.visNodes?.update({
        id: node.id,
        label: node.id.toString(),
        color: getNodeStateColor(node.state, darkMode),
      });
    });
    this.edges.forEach((edge) => {
      this.visEdges?.update({
        id: edge.id,
        from: edge.fromId,
        to: edge.toId,
        color: darkMode ? "#ffffff" : "#000000",
      });
    });
    this.network?.setOptions({
      ...this.options,
      nodes: { font: { color: darkMode ? "#ffffff" : "#000000" } },
    });
  }

  /*
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
  */
}
