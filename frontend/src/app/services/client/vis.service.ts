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
import { SimulatorService } from "./simulator.service";

@Injectable({
  providedIn: "root",
})
export class VisService {
  network: vis.Network | undefined;

  visNodes: DataSet<VisNode, "id"> | undefined;
  visEdges: DataSet<VisEdge, "id"> | undefined;

  options: vis.Options | undefined;

  constructor(
    private graph: GraphService,
    private darkMode: DarkModeService,
    private simulator: SimulatorService
  ) {}

  public drawGraph(
    type: GraphType,
    props: { key: string; value: any }[],
    container: HTMLElement
  ): Observable<void> {
    return zip(this.graph.generate(type, props), this.darkMode.darkMode$).pipe(
      delay(1000),
      map((response) => {
        const graph = response[0];
        const darkMode = response[1];
        this.simulator.graph.nodes = [];
        this.simulator.graph.edges = [];

        this.visNodes = new DataSet(
          graph.nodes.map((node: Node) => {
            this.simulator.graph.nodes.push(node);
            return {
              id: node.id,
              label: node.id.toString(),
              color: getNodeStateColor(node.state, darkMode),
            } as VisNode;
          })
        );

        this.visEdges = new DataSet(
          graph.edges.map((edge: Edge) => {
            this.simulator.graph.edges.push(edge);
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

  public updateGraph(): Observable<void> {
    return this.darkMode.darkMode$.pipe(
      map((darkMode) => {
        this.simulator.graph.nodes.forEach((node: Node) => {
          this.visNodes?.update({
            id: node.id,
            label: node.id.toString(),
            color: getNodeStateColor(node.state, darkMode),
          });
        });
        this.simulator.graph.edges.forEach((edge: Edge) => {
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
      })
    );
  }

  public destoryGraph(): void {
    this.network?.destroy();
  }
}
