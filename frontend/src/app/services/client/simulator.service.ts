import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, firstValueFrom, map, Observable } from "rxjs";
import { AlgorithmType } from "src/app/models/algorithm/AlgorithmType";
import { Robot } from "src/app/models/algorithm/Robot";
import { RobotState } from "src/app/models/algorithm/RobotState";
import { DispersionType } from "src/app/models/fault/DispersionType";
import { Graph } from "src/app/models/graph/Graph";
import { GraphType } from "src/app/models/graph/GraphType";
import { NodeState } from "src/app/models/graph/NodeState";
import { SimulationState } from "src/app/models/simulation/SimulationState";
import { SnackBarType } from "src/app/models/utils/SnackBar";
import { AlgorithmService } from "../server/algorithm.service";
import { ResultService } from "../server/result.service";
import { SnackBarService } from "./snack-bar.service";

@Injectable({
  providedIn: "root",
})
export class SimulatorService {
  running: boolean = false;
  saveResults: boolean = true;
  showInformations: boolean = true;
  simulateFaults: boolean = true;

  delay: number = 500;

  // Meta
  step: number = 0;
  state: SimulationState = SimulationState.DEFAULT;
  graphType: GraphType | undefined;
  algorithmType: AlgorithmType | undefined;

  // Faults
  faultLimit: number | undefined = undefined;
  faultProbability: number | undefined = undefined;
  dispersionType: DispersionType | undefined = undefined;

  // Core
  graph: Graph = { nodes: [], edges: [] };
  teams: number = 0;
  robots: BehaviorSubject<Robot[]> = new BehaviorSubject<Robot[]>([]);

  constructor(
    private algorithm: AlgorithmService,
    private result: ResultService,
    private snackBar: SnackBarService
  ) {}

  async play(callbackFns: (() => Promise<any>)[]): Promise<void> {
    this.running = true;
    while (this.running && this.state !== SimulationState.FINISHED) {
      await this.next(callbackFns);
    }
    this.running = false;
  }

  async next(callbackFns: (() => Promise<any>)[]): Promise<void> {
    const stepFn: Observable<any> = !this.simulateFaults
      ? this.algorithm.step(this.algorithmType!, {
          step: this.step,
          state: this.state,
          graph: this.graph,
          robots: this.robots.getValue(),
        })
      : this.algorithm.stepFault(this.algorithmType!, {
          step: this.step,
          state: this.state,
          graph: this.graph,
          robots: this.robots.getValue(),
          faults: this.faultLimit!,
          probability: this.faultProbability!,
        });
    await firstValueFrom(
      stepFn.pipe(
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
    if (
      (this.state === SimulationState.FINISHED ||
        this.robots
          .getValue()
          .map(
            (robot) =>
              robot.state === RobotState.TERMINATED ||
              robot.state === RobotState.CRASHED
          )
          .every((finishedState) => finishedState === true)) &&
      this.saveResults
    ) {
      this.result
        .save({
          id: null,
          algorithmType: this.algorithmType,
          graphType: this.graphType,
          steps: this.step,
          nodes: this.graph.nodes.length,
          teams: this.teams,
          robots: this.robots.getValue().length,
          crashes: this.robots
            .getValue()
            .filter((robot) => robot.state === RobotState.CRASHED).length,
          faults: this.faultLimit ? this.faultLimit : 0,
          probability: this.faultProbability ? this.faultProbability : 0,
        })
        .subscribe({
          next: async () => {
            await this.snackBar.openSnackBar(
              "simulator.successfulSaving",
              SnackBarType.SUCCESS
            );
          },
          error: async () => {
            await this.snackBar.openSnackBar(
              "simulator.failedToSave",
              SnackBarType.ERROR
            );
          },
        });
    }
  }

  stop(): void {
    this.running = false;
  }

  reset(): void {
    this.step = 0;
    this.teams = 0;
    this.state = SimulationState.DEFAULT;
    this.graphType = undefined;
    this.algorithmType = undefined;
    this.dispersionType = undefined;
    this.graph = { nodes: [], edges: [] };
    this.robots.next([]);
    this.faultLimit = undefined;
    this.faultProbability = undefined;
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

  toggleSaveResults(value: boolean): void {
    this.saveResults = value;
  }

  toggleShowInformations(value: boolean): void {
    this.showInformations = value;
  }

  toggleSimulateFaults(value: boolean): void {
    this.simulateFaults = value;
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
