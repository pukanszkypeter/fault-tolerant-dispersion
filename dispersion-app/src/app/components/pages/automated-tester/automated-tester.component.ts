import { Component, OnInit } from '@angular/core';
import { VisService } from '../../../services/client-side/vis/vis.service';
import { GraphConfiguration } from '../simulator/graph-configuration/GraphConfiguration';
import { AlgorithmConfiguration } from '../simulator/algorithm-configuration/AlgorithmConfiguration';
import { GraphConfigurationComponent } from '../simulator/graph-configuration/graph-configuration.component';
import { MatDialog } from '@angular/material/dialog';
import { AlgorithmConfigurationComponent } from '../simulator/algorithm-configuration/algorithm-configuration.component';
import { FormControl, Validators } from '@angular/forms';
import { AlgorithmService } from '../../../services/server-side/java-engine/algorithm-service/algorithm.service';
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
import { LoggerService } from 'src/app/services/server-side/python-engine/logger-service/logger.service';

@Component({
  selector: 'app-automated-test',
  templateUrl: './automated-tester.component.html',
  styleUrls: ['./automated-tester.component.css'],
})
export class AutomatedTesterComponent implements OnInit {
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

  testsInProgress = false;
  tests: FormControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(1000),
  ]);

  testRatio: number = 0;
  stepsList: number[] = [];
  serverList: number[] = [];
  summary = [{ tests: 0, success: 0, failed: 0, steps: 0, server: 0 }];
  summaryColumns = ['tests', 'success', 'failed', 'steps', 'server'];

  constructor(
    private visService: VisService,
    private algorithmService: AlgorithmService,
    private loggerService: LoggerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  configureGraph(): void {
    this.resetGraph();
    const dialogRef = this.dialog.open(GraphConfigurationComponent, {
      data: { automatedMode: true },
      height: '50%',
      width: '30%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.graphConfiguration = new GraphConfiguration().initialize(res);
          this.visService.initDataFromConfig(this.graphConfiguration);

        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  configureAlgorithm(): void {
    this.resetAlgorithm();
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
              break;

            default:
              throw new Error('Algorithm type not found!');
          }


        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resetGraph(): void {
    this.graphConfiguration = null;
    if (this.algorithmConfiguration) {
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
      }
    }
    this.algorithmConfiguration = null;
    this.stepsList = [];
    this.serverList = [];
    this.summary = [{ tests: 0, success: 0, failed: 0, steps: 0, server: 0 }];
    this.testRatio = 0;
  }

  resetAlgorithm(): void {
    if (this.algorithmConfiguration) {
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
      }
    }
    this.algorithmConfiguration = null;
    this.stepsList = [];
    this.serverList = [];
    this.summary = [{ tests: 0, success: 0, failed: 0, steps: 0, server: 0 }];
    this.testRatio = 0;
  }

  run(tests: number): void {
    this.testsInProgress = true;
    let simulation: any;
    switch (this.algorithmConfiguration.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        simulation = this.randomSimulation;
        break;
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        simulation = this.randomWithLeaderSimulation;
        break;
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        simulation = this.rotorRouterSimulation;
        break;
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        simulation = this.rotorRouterWithLeaderSimulation;
        break;
    }
    if (tests > 0) {
      const start = new Date();
      this.algorithmService
        .test(this.algorithmConfiguration.algorithmType, simulation)
        .subscribe(
          (res) => {
            const end = new Date();
            if (res) {
              this.loggerService
                .log({
                  graphType: this.graphConfiguration.graphType,
                  algorithmType: this.algorithmConfiguration.algorithmType,
                  nodes: this.graphConfiguration.nodes,
                  robots: simulation.robotList.length,
                  steps: res,
                })
                .subscribe(
                  (tes) => {
                    if (tes) {
                      tests--;
                      this.summary[0].tests++;
                      this.summary[0].success++;
                      this.stepsList.push(res);
                      this.summary[0].steps =
                        this.stepsList.reduce((a, b) => a + b, 0) /
                        this.summary[0].tests;
                      this.serverList.push(end.valueOf() - start.valueOf());
                      this.summary[0].server =
                        this.serverList.reduce((a, b) => a + b, 0) /
                        this.summary[0].tests;
                      this.testRatio = Math.ceil(
                        (this.summary[0].tests /
                          (tests + this.summary[0].tests)) *
                          100
                      );
                      setTimeout(() => this.run(tests), 500);
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            } else {
              tests--;
              this.summary[0].tests++;
              this.summary[0].failed++;
              this.serverList.push(end.valueOf() - start.valueOf());
              this.summary[0].server =
                this.serverList.reduce((a, b) => a + b, 0) /
                this.summary[0].tests;
              this.testRatio = Math.ceil(
                (this.summary[0].tests / (tests + this.summary[0].tests)) * 100
              );
              setTimeout(() => this.run(tests), 500);
            }
          },
          (err) => {
            const end = new Date();
            console.log(err);
            tests--;
            this.summary[0].tests++;
            this.summary[0].failed++;
            this.serverList.push(end.valueOf() - start.valueOf());
            this.summary[0].server =
              this.serverList.reduce((a, b) => a + b, 0) /
              this.summary[0].tests;
            this.testRatio = Math.ceil(
              (this.summary[0].tests / (tests + this.summary[0].tests)) * 100
            );
            setTimeout(() => this.run(tests), 500);
          }
        );
    } else {
      this.testsInProgress = false;
    }
  }
}
