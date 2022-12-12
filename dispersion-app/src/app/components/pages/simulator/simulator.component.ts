import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GraphConfigurationComponent } from './graph-configuration/graph-configuration.component';
import { SnackbarService } from '../../../services/client-side/utils/snackbar.service';
import { GraphConfiguration } from './graph-configuration/GraphConfiguration';
import { VisService } from '../../../services/client-side/vis/vis.service';
import { AlgorithmConfigurationComponent } from './algorithm-configuration/algorithm-configuration.component';
import { AlgorithmConfiguration } from './algorithm-configuration/AlgorithmConfiguration';
import { AlgorithmService } from '../../../services/server-side/java-engine/algorithm-service/algorithm.service';
import { GraphGeneratorService } from '../../../services/client-side/graph-generator/graph-generator.service';
import { LogFormComponent } from './log-form/log-form.component';
import { SimulationStep } from 'src/app/models/dto/SimulationStep';
import { SimulationState } from 'src/app/models/utils/SimulationState';
import { RandomDispersionNode } from 'src/app/models/algorithms/random-dispersion/RandomDispersionNode';
import { RandomDispersionEdge } from 'src/app/models/algorithms/random-dispersion/RandomDispersionEdge';
import { RandomDispersionRobot } from 'src/app/models/algorithms/random-dispersion/RandomDispersionRobot';
import { RandomWithLeaderDispersionNode } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionNode';
import { RandomWithLeaderDispersionEdge } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionEdge';
import { RandomWithLeaderDispersionRobot } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionRobot';
import { RotorRouterDispersionNode } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionNode';
import { RotorRouterDispersionEdge } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionEdge';
import { RotorRouterDispersionRobot } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionRobot';
import { RotorRouterWithLeaderDispersionNode } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionNode';
import { RotorRouterWithLeaderDispersionEdge } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionEdge';
import { RotorRouterWithLeaderDispersionRobot } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionRobot';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';
import { Graph } from 'src/app/models/core/Graph';
import { NodeState } from 'src/app/models/utils/NodeState';
import { FaultlessDfsDispersionNode } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionNode';
import { FaultlessDfsDispersionEdge } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionEdge';
import { FaultlessDfsDispersionRobot } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionRobot';
import { FaultyDfsDispersionNode } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionNode';
import { FaultyDfsDispersionEdge } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionEdge';
import { FaultyDfsDispersionRobot } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionRobot';
import { RobotState } from 'src/app/models/utils/RobotState';

@Component({
  selector: 'app-static',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
})
export class SimulatorComponent implements OnInit {
  graphConfiguration: GraphConfiguration;
  algorithmConfiguration: AlgorithmConfiguration;

  randomSimulation: SimulationStep<
    RandomDispersionNode,
    RandomDispersionEdge,
    RandomDispersionRobot
  >;
  randomWithLeaderSimulation: SimulationStep<
    RandomWithLeaderDispersionNode,
    RandomWithLeaderDispersionEdge,
    RandomWithLeaderDispersionRobot
  >;
  rotorRouterSimulation: SimulationStep<
    RotorRouterDispersionNode,
    RotorRouterDispersionEdge,
    RotorRouterDispersionRobot
  >;
  rotorRouterWithLeaderSimulation: SimulationStep<
    RotorRouterWithLeaderDispersionNode,
    RotorRouterWithLeaderDispersionEdge,
    RotorRouterWithLeaderDispersionRobot
  >;
  faultlessDfsSimulation: SimulationStep<
    FaultlessDfsDispersionNode,
    FaultlessDfsDispersionEdge,
    FaultlessDfsDispersionRobot
  >;
  faultyDfsSimulation: SimulationStep<
    FaultyDfsDispersionNode,
    FaultyDfsDispersionEdge,
    FaultyDfsDispersionRobot
  >;

  speed: number = 750;
  RTT: number = 0;
  STOPPED = false;

  displayedColumns = ['ID', 'onID', 'state', 'stateIcon'];
  faultyDisplayedColumns = ['ID', 'onID', 'label', 'state', 'stateIcon', 'crash'];

  constructor(
    private snackBarService: SnackbarService,
    private visService: VisService,
    private algorithmService: AlgorithmService,
    private graphGeneratorService: GraphGeneratorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  /** Settings */

  openGraphConfiguration(): void {
    const dialogRef = this.dialog.open(GraphConfigurationComponent, {
      data: { automatedMode: false },
      height: '50%',
      width: '30%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.graphConfiguration = new GraphConfiguration().initialize(res);
          this.initSimulator(this.graphConfiguration);
          this.snackBarService.openSnackBar(
            'pages.simulator.graphCreated',
            'success-snackbar',
            null,
            'right',
            'bottom'
          );
        }
      },
      (err) => {
        console.log(err);
        this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
      }
    );
  }

  openAlgorithmConfiguration(): void {
    const dialogRef = this.dialog.open(AlgorithmConfigurationComponent, {
      data: { startNodes: this.visService.getStartNodes() },
      height: '70%',
      width: '40%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.algorithmConfiguration = new AlgorithmConfiguration().initialize(
            res
          );
          switch (this.algorithmConfiguration.algorithmType) {
            case AlgorithmType.RANDOM_DISPERSION:
              this.randomSimulation = new SimulationStep(
                this.algorithmConfiguration.algorithmType,
                SimulationState.DEFAULT,
                0,
                new Graph<RandomDispersionNode, RandomDispersionEdge>(
                  this.visService.nodes.map(
                    (node) =>
                      new RandomDispersionNode(node.id, NodeState.DEFAULT)
                  ),
                  this.visService.edges.map(
                    (edge) =>
                      new RandomDispersionEdge(edge.id, edge.from, edge.to)
                  )
                ),
                this.algorithmConfiguration.robots
              );
              this.randomSimulation.graph.nodeList
                .filter((node) =>
                  [
                    ...new Set(
                      this.randomSimulation.robotList.map((robot) => robot.onID)
                    ),
                  ].includes(node.id)
                )
                .forEach((node) => (node.state = NodeState.PENDING));
              this.visService.update(this.randomSimulation.graph.nodeList);
              break;

            case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
              this.randomWithLeaderSimulation = new SimulationStep(
                this.algorithmConfiguration.algorithmType,
                SimulationState.DEFAULT,
                0,
                new Graph<
                  RandomWithLeaderDispersionNode,
                  RandomWithLeaderDispersionEdge
                >(
                  this.visService.nodes.map(
                    (node) =>
                      new RandomWithLeaderDispersionNode(
                        node.id,
                        NodeState.DEFAULT
                      )
                  ),
                  this.visService.edges.map(
                    (edge) =>
                      new RandomWithLeaderDispersionEdge(
                        edge.id,
                        edge.from,
                        edge.to
                      )
                  )
                ),
                this.algorithmConfiguration.robots
              );
              this.randomWithLeaderSimulation.graph.nodeList
                .filter((node) =>
                  [
                    ...new Set(
                      this.randomWithLeaderSimulation.robotList.map(
                        (robot) => robot.onID
                      )
                    ),
                  ].includes(node.id)
                )
                .forEach((node) => (node.state = NodeState.PENDING));
              this.visService.update(
                this.randomWithLeaderSimulation.graph.nodeList
              );
              break;

            case AlgorithmType.ROTOR_ROUTER_DISPERSION:
              this.rotorRouterSimulation = new SimulationStep(
                this.algorithmConfiguration.algorithmType,
                SimulationState.DEFAULT,
                0,
                new Graph<RotorRouterDispersionNode, RotorRouterDispersionEdge>(
                  this.visService.nodes.map(
                    (node) =>
                      new RotorRouterDispersionNode(
                        node.id,
                        NodeState.DEFAULT,
                        null
                      )
                  ),
                  this.visService.edges.map(
                    (edge) =>
                      new RotorRouterDispersionEdge(edge.id, edge.from, edge.to)
                  )
                ),
                this.algorithmConfiguration.robots
              );
              this.rotorRouterSimulation.graph.nodeList
                .filter((node) =>
                  [
                    ...new Set(
                      this.rotorRouterSimulation.robotList.map(
                        (robot) => robot.onID
                      )
                    ),
                  ].includes(node.id)
                )
                .forEach((node) => (node.state = NodeState.PENDING));
              this.visService.update(this.rotorRouterSimulation.graph.nodeList);
              break;

            case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
              this.rotorRouterWithLeaderSimulation = new SimulationStep(
                this.algorithmConfiguration.algorithmType,
                SimulationState.DEFAULT,
                0,
                new Graph<
                  RotorRouterWithLeaderDispersionNode,
                  RotorRouterWithLeaderDispersionEdge
                >(
                  this.visService.nodes.map(
                    (node) =>
                      new RotorRouterWithLeaderDispersionNode(
                        node.id,
                        NodeState.DEFAULT,
                        null
                      )
                  ),
                  this.visService.edges.map(
                    (edge) =>
                      new RotorRouterWithLeaderDispersionEdge(
                        edge.id,
                        edge.from,
                        edge.to
                      )
                  )
                ),
                this.algorithmConfiguration.robots
              );
              this.rotorRouterWithLeaderSimulation.graph.nodeList
                .filter((node) =>
                  [
                    ...new Set(
                      this.rotorRouterWithLeaderSimulation.robotList.map(
                        (robot) => robot.onID
                      )
                    ),
                  ].includes(node.id)
                )
                .forEach((node) => (node.state = NodeState.PENDING));
              this.visService.update(
                this.rotorRouterWithLeaderSimulation.graph.nodeList
              );
              break;

            case AlgorithmType.FAULTLESS_DFS_DISPERSION:
              this.faultlessDfsSimulation = new SimulationStep(
                this.algorithmConfiguration.algorithmType,
                SimulationState.DEFAULT,
                0,
                new Graph<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge>(
                  this.visService.nodes.map(
                    (node) => new FaultlessDfsDispersionNode(node.id, NodeState.DEFAULT)
                  ),
                  this.visService.edges.map(
                    (edge) =>
                      new FaultlessDfsDispersionEdge(edge.id, edge.from, edge.to, 0, 0)
                  )
                ),
                this.algorithmConfiguration.robots
              );
              this.graphGeneratorService.labelPorts(this.faultlessDfsSimulation.graph);
              this.faultlessDfsSimulation.graph.nodeList
                .filter((node) =>
                  [
                    ...new Set(
                      this.faultlessDfsSimulation.robotList.map((robot) => robot.onID)
                    ),
                  ].includes(node.id)
                )
                .forEach((node) => (node.state = NodeState.PENDING));
              this.visService.update(this.faultlessDfsSimulation.graph.nodeList);
              break;

              case AlgorithmType.FAULTY_DFS_DISPERSION:
              this.faultyDfsSimulation = new SimulationStep(
                this.algorithmConfiguration.algorithmType,
                SimulationState.DEFAULT,
                0,
                new Graph<FaultyDfsDispersionNode, FaultyDfsDispersionEdge>(
                  this.visService.nodes.map(
                    (node) => new FaultyDfsDispersionNode(node.id, NodeState.DEFAULT)
                  ),
                  this.visService.edges.map(
                    (edge) =>
                      new FaultyDfsDispersionEdge(edge.id, edge.from, edge.to, 0, 0)
                  )
                ),
                this.algorithmConfiguration.robots
              );
              this.graphGeneratorService.labelPorts(this.faultyDfsSimulation.graph);
              this.faultyDfsSimulation.graph.nodeList
                .filter((node) =>
                  [
                    ...new Set(
                      this.faultyDfsSimulation.robotList.map((robot) => robot.onID)
                    ),
                  ].includes(node.id)
                )
                .forEach((node) => (node.state = NodeState.PENDING));
              this.visService.update(this.faultyDfsSimulation.graph.nodeList);
              break;

            default:
              throw new Error('Algorithm type not found!');
          }

          this.snackBarService.openSnackBar(
            'pages.simulator.algorithmInitalized',
            'success-snackbar',
            null,
            'right',
            'bottom'
          );
        }
      },
      (err) => {
        console.log(err);
        this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
      }
    );
  }

  /** Simulator */

  initSimulator(configuration: GraphConfiguration): void {
    const container = document.getElementById('vis-container');
    this.visService.initGraphFromConfig(configuration, container, {
      nodes: {
        shape: 'dot',
        borderWidth: 1,
        shadow: true,
        font: {
          size: 32,
          color: '#000000',
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
    });
  }

  resetSimulator(): void {
    this.speed = 750;
    this.RTT = 0;
    this.STOPPED = false;
    switch (this.algorithmConfiguration.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        this.randomSimulation = null;
        break;
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        this.randomWithLeaderSimulation = null;
        break;
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        this.rotorRouterSimulation = null;
        break;
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        this.rotorRouterWithLeaderSimulation = null;
        break;
      case AlgorithmType.FAULTLESS_DFS_DISPERSION:
        this.faultlessDfsSimulation = null;
        break;
      case AlgorithmType.FAULTY_DFS_DISPERSION:
        this.faultyDfsSimulation = null;
        break;
    }
    this.algorithmConfiguration = null;
    this.graphConfiguration = null;
    this.visService.network.destroy();
  }

  async playSimulator(): Promise<void> {
    this.STOPPED = false;
    let currentSimulation;
    switch (this.algorithmConfiguration.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        currentSimulation = this.randomSimulation;
        break;
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        currentSimulation = this.randomWithLeaderSimulation;
        break;
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        currentSimulation = this.rotorRouterSimulation;
        break;
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        currentSimulation = this.rotorRouterWithLeaderSimulation;
        break;
      case AlgorithmType.FAULTLESS_DFS_DISPERSION:
        currentSimulation = this.faultlessDfsSimulation;
        break;
      case AlgorithmType.FAULTY_DFS_DISPERSION:
        currentSimulation = this.faultyDfsSimulation;
        break;
    }
    while (
      !this.STOPPED &&
      currentSimulation.simulationState !== SimulationState.FINISHED
    ) {
      await this.stepSimulator();
      await this.sleep(this.speed);
    }
  }

  stopSimulator(): void {
    this.STOPPED = true;
  }

  async stepSimulator(): Promise<void> {
    switch (this.algorithmConfiguration.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        if (
          this.randomSimulation.simulationState !== SimulationState.FINISHED
        ) {
          const start = new Date();
          this.algorithmService.stepRandom(this.randomSimulation).subscribe(
            (
              res: SimulationStep<
                RandomDispersionNode,
                RandomDispersionEdge,
                RandomDispersionRobot
              >
            ) => {
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.randomSimulation = res;
              this.visService.update(this.randomSimulation.graph.nodeList);
              if (
                this.randomSimulation.simulationState ===
                SimulationState.FINISHED
              ) {
                this.snackBarService.openSnackBar(
                  'SIMULATION_FINISHED',
                  'success-snackbar',
                  null,
                  null,
                  null,
                  10000
                );
              }
            },
            (err) => {
              console.log(err);
              this.snackBarService.openSnackBar(
                'SERVER_ERROR',
                'error-snackbar'
              );
            }
          );
        }
        break;

      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        if (
          this.randomWithLeaderSimulation.simulationState !==
          SimulationState.FINISHED
        ) {
          const start = new Date();
          this.algorithmService
            .stepRandomWithLeader(this.randomWithLeaderSimulation)
            .subscribe(
              (res) => {
                const end = new Date();
                this.RTT = end.valueOf() - start.valueOf();
                this.randomWithLeaderSimulation = res;
                this.visService.update(
                  this.randomWithLeaderSimulation.graph.nodeList
                );
                if (
                  this.randomWithLeaderSimulation.simulationState ===
                  SimulationState.FINISHED
                ) {
                  this.snackBarService.openSnackBar(
                    'SIMULATION_FINISHED',
                    'success-snackbar',
                    null,
                    null,
                    null,
                    10000
                  );
                }
              },
              (err) => {
                console.log(err);
                this.snackBarService.openSnackBar(
                  'SERVER_ERROR',
                  'error-snackbar'
                );
              }
            );
        }
        break;

      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        if (
          this.rotorRouterSimulation.simulationState !==
          SimulationState.FINISHED
        ) {
          const start = new Date();
          this.algorithmService
            .stepRotorRouter(this.rotorRouterSimulation)
            .subscribe(
              (res) => {
                const end = new Date();
                this.RTT = end.valueOf() - start.valueOf();
                this.rotorRouterSimulation = res;
                this.visService.update(
                  this.rotorRouterSimulation.graph.nodeList
                );
                if (
                  this.rotorRouterSimulation.simulationState ===
                  SimulationState.FINISHED
                ) {
                  this.snackBarService.openSnackBar(
                    'SIMULATION_FINISHED',
                    'success-snackbar',
                    null,
                    null,
                    null,
                    10000
                  );
                }
              },
              (err) => {
                console.log(err);
                this.snackBarService.openSnackBar(
                  'SERVER_ERROR',
                  'error-snackbar'
                );
              }
            );
        }
        break;

      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        if (
          this.rotorRouterWithLeaderSimulation.simulationState !==
          SimulationState.FINISHED
        ) {
          const start = new Date();
          this.algorithmService
            .stepRotorRouterWithLeader(this.rotorRouterWithLeaderSimulation)
            .subscribe(
              (res) => {
                const end = new Date();
                this.RTT = end.valueOf() - start.valueOf();
                this.rotorRouterWithLeaderSimulation = res;
                this.visService.update(
                  this.rotorRouterWithLeaderSimulation.graph.nodeList
                );
                if (
                  this.rotorRouterWithLeaderSimulation.simulationState ===
                  SimulationState.FINISHED
                ) {
                  this.snackBarService.openSnackBar(
                    'SIMULATION_FINISHED',
                    'success-snackbar',
                    null,
                    null,
                    null,
                    10000
                  );
                }
              },
              (err) => {
                console.log(err);
                this.snackBarService.openSnackBar(
                  'SERVER_ERROR',
                  'error-snackbar'
                );
              }
            );
        }
        break;

      case AlgorithmType.FAULTLESS_DFS_DISPERSION:
        if (this.faultlessDfsSimulation.simulationState !== SimulationState.FINISHED) {
          const start = new Date();
          this.algorithmService.stepFaultlessDfs(this.faultlessDfsSimulation).subscribe(
            (
              res: SimulationStep<
                FaultlessDfsDispersionNode,
                FaultlessDfsDispersionEdge,
                FaultlessDfsDispersionRobot
              >
            ) => {
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.faultlessDfsSimulation = res;
              this.visService.update(this.faultlessDfsSimulation.graph.nodeList);
              if (
                this.faultlessDfsSimulation.simulationState === SimulationState.FINISHED
              ) {
                this.snackBarService.openSnackBar(
                  'SIMULATION_FINISHED',
                  'success-snackbar',
                  null,
                  null,
                  null,
                  10000
                );
              }
            },
            (err) => {
              console.log(err);
              this.snackBarService.openSnackBar(
                'SERVER_ERROR',
                'error-snackbar'
              );
            }
          );
        }
        break;

        case AlgorithmType.FAULTY_DFS_DISPERSION:
        if (this.faultyDfsSimulation.simulationState !== SimulationState.FINISHED) {
          const start = new Date();
          this.algorithmService.stepFaultyDfs(this.faultyDfsSimulation).subscribe(
            (
              res: SimulationStep<
                FaultyDfsDispersionNode,
                FaultyDfsDispersionEdge,
                FaultyDfsDispersionRobot
              >
            ) => {
              console.log(res);
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.faultyDfsSimulation = res;
              this.visService.update(this.faultyDfsSimulation.graph.nodeList);
              if (
                this.faultyDfsSimulation.simulationState === SimulationState.FINISHED
              ) {
                this.snackBarService.openSnackBar(
                  'SIMULATION_FINISHED',
                  'success-snackbar',
                  null,
                  null,
                  null,
                  10000
                );
              }
            },
            (err) => {
              console.log(err);
              this.snackBarService.openSnackBar(
                'SERVER_ERROR',
                'error-snackbar'
              );
            }
          );
        }
        break;
    }
  }

  /** Helper Methods */

  save(): void {
    let robotsSize;
    let steps;

    switch (this.algorithmConfiguration.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        robotsSize = this.randomSimulation.robotList.length;
        steps = this.randomSimulation.step;
        break;
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        robotsSize = this.randomWithLeaderSimulation.robotList.length;
        steps = this.randomWithLeaderSimulation.step;
        break;
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        robotsSize = this.rotorRouterSimulation.robotList.length;
        steps = this.rotorRouterSimulation.step;
        break;
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        robotsSize = this.rotorRouterWithLeaderSimulation.robotList.length;
        steps = this.rotorRouterWithLeaderSimulation.step;
        break;
      case AlgorithmType.FAULTLESS_DFS_DISPERSION:
        robotsSize = this.faultlessDfsSimulation.robotList.length;
        steps = this.faultlessDfsSimulation.step;
        break;
      case AlgorithmType.FAULTY_DFS_DISPERSION:
        robotsSize = this.faultyDfsSimulation.robotList.length;
        steps = this.faultyDfsSimulation.step;
        break;
    }

    const dialogRef = this.dialog.open(LogFormComponent, {
      data: {
        graphType: this.graphConfiguration.graphType,
        algorithmType: this.algorithmConfiguration.algorithmType,
        nodes: this.graphConfiguration.nodes,
        robots: robotsSize,
        steps: steps,
      },
      height: '45%',
      width: '40%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.resetSimulator();
        }
      },
      (err) => {
        console.log(err);
        this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
      }
    );
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getRobots(): any[] {
    switch (this.algorithmConfiguration.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        return this.randomSimulation.robotList;
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        return this.randomWithLeaderSimulation.robotList;
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        return this.rotorRouterSimulation.robotList;
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        return this.rotorRouterWithLeaderSimulation.robotList;
      case AlgorithmType.FAULTLESS_DFS_DISPERSION:
        return this.faultlessDfsSimulation.robotList;
      case AlgorithmType.FAULTY_DFS_DISPERSION:
        return this.faultyDfsSimulation.robotList;
    }
  }

  getSteps(): number {
    if (this.algorithmConfiguration) {
      switch (this.algorithmConfiguration.algorithmType) {
        case AlgorithmType.RANDOM_DISPERSION:
          return this.randomSimulation.step;
        case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
          return this.randomWithLeaderSimulation.step;
        case AlgorithmType.ROTOR_ROUTER_DISPERSION:
          return this.rotorRouterSimulation.step;
        case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
          return this.rotorRouterWithLeaderSimulation.step;
        case AlgorithmType.FAULTLESS_DFS_DISPERSION:
          return this.faultlessDfsSimulation.step;
        case AlgorithmType.FAULTY_DFS_DISPERSION:
          return this.faultyDfsSimulation.step;
      }
    } else {
      return 0;
    }
  }

  isSaveDisabled(): boolean {
    if (this.algorithmConfiguration) {
      switch (this.algorithmConfiguration.algorithmType) {
        case AlgorithmType.RANDOM_DISPERSION:
          return (
            !this.randomSimulation ||
            this.randomSimulation.simulationState !== SimulationState.FINISHED
          );
        case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
          return (
            !this.randomWithLeaderSimulation ||
            this.randomWithLeaderSimulation.simulationState !==
              SimulationState.FINISHED
          );
        case AlgorithmType.ROTOR_ROUTER_DISPERSION:
          return (
            !this.rotorRouterSimulation ||
            this.rotorRouterSimulation.simulationState !==
              SimulationState.FINISHED
          );
        case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
          return (
            !this.rotorRouterWithLeaderSimulation ||
            this.rotorRouterWithLeaderSimulation.simulationState !==
              SimulationState.FINISHED
          );
        case AlgorithmType.FAULTLESS_DFS_DISPERSION:
          return (
            !this.faultlessDfsSimulation ||
            this.faultlessDfsSimulation.simulationState !== SimulationState.FINISHED
          );
        case AlgorithmType.FAULTY_DFS_DISPERSION:
          return (
            !this.faultyDfsSimulation ||
            this.faultyDfsSimulation.simulationState !== SimulationState.FINISHED
          );
      }
    } else {
      return true;
    }
  }

  crashRobot(robot: FaultyDfsDispersionRobot): void {
    if (robot.state == RobotState.SETTLED) {
      const nodeIndex = this.faultyDfsSimulation.graph.nodeList.findIndex(node => node.id === robot.onID); 
      if (nodeIndex > -1) {
        this.faultyDfsSimulation.graph.nodeList[nodeIndex].state = NodeState.DEFAULT;
      }
      this.visService.update(this.faultyDfsSimulation.graph.nodeList);
    }
    robot.state = RobotState.CRASHED;
  }

}
