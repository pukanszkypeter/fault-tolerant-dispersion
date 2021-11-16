import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {GraphConfigurationComponent} from "./graph-configuration/graph-configuration.component";
import {SnackbarService} from "../../services/client-side/utils/snackbar.service";
import {GraphConfiguration} from "../../models/entities/simulator/GraphConfiguration";
import {SimulationState, simulationStates} from "../../models/entities/simulator/SimulationState";
import {VisService} from "../../services/client-side/vis.service";
import {AlgorithmConfigurationComponent} from "./algorithm-configuration/algorithm-configuration.component";
import {Edge} from "../../models/entities/vis/Edge";
import {Node} from "../../models/entities/vis/Node";

@Component({
  selector: 'app-static',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  // states = simulationStates;

  // simulationState: SimulationState;
  // simulationStateDate: Date;

  graphConfiguration: GraphConfiguration;

  displayedColumns = ['id', 'color', 'position', 'state'];

  // Vis.js
  network: any;

  constructor(private snackBarService: SnackbarService,
              private visService: VisService,
              public dialog: MatDialog) {

    // this.changeState(0);
  }

  ngOnInit(): void {
  }

  /** Settings */

  openGraphConfiguration(): void {
    const dialogRef = this.dialog.open(GraphConfigurationComponent, {height: "50%", width: "30%", disableClose: true});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.changeState(1);
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
        data: {startNodes: this.visService.getStartNodes(), robotLimit: this.graphConfiguration.nodes},
        height: "70%",
        width: "40%",
        disableClose: true
      });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        // this.changeState(1);
        // this.graphConfiguration = new GraphConfiguration().initialize(res);
        // this.initSimulation(this.simulationConfiguration);
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

    this.network = this.visService.initGraphFromConfig(configuration, container, {});
  }

  /** Helper Methods */

  /*changeState(state: number): void {
    this.simulationState = this.states[state];
    this.simulationStateDate = new Date();
  }*/

}
