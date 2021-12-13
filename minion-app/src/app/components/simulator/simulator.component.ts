import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {GraphConfigurationComponent} from "./graph-configuration/graph-configuration.component";
import {SnackbarService} from "../../services/client-side/utils/snackbar.service";
import {GraphConfiguration} from "./graph-configuration/GraphConfiguration";
import {VisService} from "../../services/client-side/vis/vis.service";
import {AlgorithmConfigurationComponent} from "./algorithm-configuration/algorithm-configuration.component";
import {AlgorithmConfiguration} from "./algorithm-configuration/AlgorithmConfiguration";
import {SimulationState} from "../../models/entities/SimulationState";
import {AlgorithmService} from "../../services/server-side/algorithms/algorithm.service";
import {RobotState} from "../../models/entities/Robot";


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
  steps: number;

  STOPPED = false;

  displayedColumns = ['ID', 'onID', 'color', 'state', 'stateIcon'];

  constructor(private snackBarService: SnackbarService,
              private visService: VisService,
              private algorithmService: AlgorithmService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  /** Settings */

  openGraphConfiguration(): void {
    const dialogRef = this.dialog.open(GraphConfigurationComponent, {height: "50%", width: "30%", disableClose: true});

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
        this.steps = 0;
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
    this.steps = 0;
    this.algorithmConfiguration = null;
    this.graphConfiguration = null;
    this.visService.network.destroy();
  }

  async stepSimulator(): Promise<void> {
    this.algorithmService
      .step(this.algorithmConfiguration.algorithmType, this.simulationState)
      .subscribe(res => {
        this.steps++;
        this.simulationState = new SimulationState().init(res);
        console.log(this.simulationState.counter);
        this.visService.update(this.simulationState.nodes);
        if (this.simulationState.counter === 0) {
          this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 5000);
        } else if (this.simulationState.robots.filter(r => r.state === RobotState.FINISHED).length === this.simulationState.robots.length) {
          this.snackBarService.openSnackBar('SIMULATION_STUCK', 'warning-snackbar', null, null, null, 5000);
        }
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
      });
  }

}
