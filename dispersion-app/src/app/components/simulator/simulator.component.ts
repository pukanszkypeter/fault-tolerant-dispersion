import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {GraphConfigurationComponent} from "./graph-configuration/graph-configuration.component";
import {SnackbarService} from "../../services/client-side/utils/snackbar.service";
import {GraphConfiguration} from "./graph-configuration/GraphConfiguration";
import {VisService} from "../../services/client-side/vis/vis.service";
import {AlgorithmConfigurationComponent} from "./algorithm-configuration/algorithm-configuration.component";
import {AlgorithmConfiguration} from "./algorithm-configuration/AlgorithmConfiguration";
import {SimulationState} from "../../models/base-entities/SimulationState";
import {AlgorithmService} from "../../services/server-side/algorithms/algorithm.service";
import {Robot, RobotState} from "../../models/base-entities/Robot";
import {LogFormComponent} from "./log-form/log-form.component";
import { HttpClient } from '@angular/common/http';
import { Edge } from 'src/app/models/base-entities/Edge';
import { Node, NodeState } from 'src/app/models/base-entities/Node';


@Component({
  selector: 'app-static',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  graphConfiguration: GraphConfiguration;
  algorithmConfiguration: AlgorithmConfiguration;

  simulationState: SimulationState;

  speed: number = 750;
  steps: number = 0;
  RTT: number = 0;
  STOPPED = false;

  displayedColumns = ['ID', 'onID', 'color', 'state', 'stateIcon'];

  constructor(private snackBarService: SnackbarService,
              private visService: VisService,
              private algorithmService: AlgorithmService,
              private http: HttpClient,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    /*
    this.http.post(
      'http://localhost:8080/api/engine/random-dispersion',
      new SimulationState().init({
        nodes: [{id: 1, state: 'DEFAULT'}, {id: 2, state: 'DEFAULT'}],
        edges: [new Edge(1, 1, 2, 'BLACK')],
        robots: [new Robot(1, 1, RobotState.START, 'BLACK', 0), new Robot(2, 1, RobotState.START, 'BLACK', 0)],
        counter: 2})
    ).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
    */
  }

  /** Settings */

  openGraphConfiguration(): void {
    const dialogRef = this.dialog.open(GraphConfigurationComponent, {data: {automatedMode: false}, height: "50%", width: "30%", disableClose: true});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.graphConfiguration = new GraphConfiguration().initialize(res);
        this.initSimulator(this.graphConfiguration);
        this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar');
      }
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
    });
  }

  openAlgorithmConfiguration(): void {
    const dialogRef = this.dialog.open(AlgorithmConfigurationComponent,
      {
        data: {startNodes: this.visService.getStartNodes()},
        height: "70%",
        width: "40%",
        disableClose: true
      });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.algorithmConfiguration = new AlgorithmConfiguration().initialize(res);
        this.simulationState = new SimulationState().initialize(
          this.visService.nodes,
          this.visService.edges,
          this.algorithmConfiguration.robots
        );
        this.visService.update(this.simulationState.nodes);
        this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar');
      }
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
    });
  }

  /** Simulator */

  initSimulator(configuration: GraphConfiguration): void {
    const container = document.getElementById('vis-container');
    this.visService.initGraphFromConfig(configuration, container, {});
  }

  resetSimulator(): void {
    this.speed = 750;
    this.steps = 0;
    this.RTT = 0;
    this.STOPPED = false;
    this.algorithmConfiguration = null;
    this.graphConfiguration = null;
    this.simulationState = null;
    this.visService.network.destroy();
  }

  async playSimulator(): Promise<void> {
    this.STOPPED = false;
    while (!this.STOPPED && this.simulationState.counter !== 0 && !this.allRobotFinished()) {
      await this.stepSimulator();
      await this.sleep(this.speed);
    }
  }

  stopSimulator(): void {
    this.STOPPED = true;
  }

  async stepSimulator(): Promise<void> {
    if (this.simulationState.counter !== 0 && !this.allRobotFinished()) {
      const start = new Date();
      this.algorithmService
        .step(this.algorithmConfiguration.algorithmType, this.simulationState)
        .subscribe(res => {
          this.steps++;
          const end = new Date();
          this.RTT = end.valueOf() - start.valueOf();
          this.simulationState = new SimulationState().init(res);
          this.visService.update(this.simulationState.nodes);
          if (this.simulationState.counter === 0) {
            this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 10000);
          } else if (this.allRobotFinished()) {
            this.snackBarService.openSnackBar('SIMULATION_STUCK', 'warning-snackbar', null, null, null, 10000);
          }
        }, err => {
          console.log(err);
          this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        });
    }
  }

  /** Helper Methods */

  save(): void {
    const dialogRef = this.dialog.open(LogFormComponent, {
      data: {
        graphType: this.graphConfiguration.graphType,
        algorithmType: this.algorithmConfiguration.algorithmType,
        nodes: this.graphConfiguration.nodes,
        robots: this.simulationState.robots.length,
        components: this.graphConfiguration.colors.length,
        steps: this.steps
      },
      height: "45%",
      width: "40%",
      disableClose: true});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
          this.resetSimulator();
      }
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
    });
  }

  allRobotFinished(): boolean {
    return this.simulationState.robots.filter(r => r.state === RobotState.SETTLED || r.state === RobotState.TERMINATED).length === this.simulationState.robots.length;
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
