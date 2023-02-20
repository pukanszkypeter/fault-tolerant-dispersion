import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, firstValueFrom, map } from "rxjs";
import { AlgorithmType } from "src/app/models/algorithm/AlgorithmType";
import { Robot } from "src/app/models/algorithm/Robot";
import { RobotState } from "src/app/models/algorithm/RobotState";
import { Graph } from "src/app/models/graph/Graph";
import { GraphType } from "src/app/models/graph/GraphType";
import { NodeState } from "src/app/models/graph/NodeState";
import { SimulationState } from "src/app/models/simulation/SimulationState";
import { AlgorithmService } from "../server/algorithm.service";

@Injectable({
  providedIn: "root",
})
export class SimulatorService {
  running: boolean = false;
  delay: number = 500;

  // Meta
  step: number = 0;
  state: SimulationState = SimulationState.DEFAULT;
  graphType: GraphType | undefined;
  algorithmType: AlgorithmType | undefined;

  // Core
  graph: Graph = { nodes: [], edges: [] };
  robots: BehaviorSubject<Robot[]> = new BehaviorSubject<Robot[]>([]);

  constructor(private algorithm: AlgorithmService) {}

  async play(callbackFns: (() => Promise<any>)[]): Promise<void> {
    this.running = true;
    while (this.running && this.state !== SimulationState.FINISHED) {
      await this.next(callbackFns);
    }
  }

  async next(callbackFns: (() => Promise<any>)[]): Promise<void> {
    await firstValueFrom(
      this.algorithm
        .step(this.algorithmType!, {
          step: this.step,
          state: this.state,
          graph: this.graph,
          robots: this.robots.getValue(),
        })
        .pipe(
          delay(this.delay),
          map((simulation) => {
            this.step = simulation.step;
            this.state = simulation.state;
            this.graph = simulation.graph;
            this.robots.next(simulation.robots);
          })
        )
    );
    for (let fn of callbackFns) {
      await fn();
    }
  }

  stop(): void {
    this.running = false;
  }

  reset(): void {
    this.step = 0;
    this.state = SimulationState.DEFAULT;
    this.graphType = undefined;
    this.algorithmType = undefined;
    this.graph = { nodes: [], edges: [] };
    this.robots.next([]);
  }

  increaseDelay(): void {
    if (this.delay !== 1000) {
      this.delay += 100;
    }
  }

  decreaseDelay(): void {
    if (this.delay !== 0) {
      this.delay -= 100;
    }
  }

  populate(distribution: { node: number; robots: number }[]): void {
    let id = 1;
    this.robots.next([]);
    this.graph.nodes.forEach((node) => (node.state = NodeState.DEFAULT));

    for (let population of distribution) {
      for (let i = 0; i < population.robots; i++) {
        this.robots.next([
          ...this.robots.getValue(),
          {
            id: id,
            state: RobotState.START,
            onId: population.node,
          },
        ]);
        id++;
      }
      const index = this.graph.nodes.findIndex(
        (node) => node.id === population.node
      );
      if (index > -1) {
        this.graph.nodes[index].state = NodeState.PENDING;
      }
    }
  }
}
