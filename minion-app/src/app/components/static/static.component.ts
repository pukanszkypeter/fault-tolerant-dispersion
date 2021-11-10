import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "./settings-dialog/settings-dialog.component";
import {SnackbarService} from "../../services/client-side/snackbar.service";
import {SimulationConfiguration} from "../../models/entities/simulation/SimulationConfiguration";
import {SimulationState, simulationStates} from "../../models/entities/simulation/SimulationState";
import {GraphGeneratorService} from "../../services/client-side/graphs/graph-generator.service";
import {VisService} from "../../services/client-side/vis.service";

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css']
})
export class StaticComponent implements OnInit {

  states = simulationStates;

  simulationState: SimulationState;
  simulationStateDate: Date;
  simulationConfiguration: SimulationConfiguration = null;

  displayedColumns = ['id', 'color', 'position', 'state'];

  // Vis.js
  network: any;

  constructor(private snackBarService: SnackbarService,
              private graphGenerator: GraphGeneratorService,
              private visService: VisService,
              public dialog: MatDialog) {

    this.changeState(0);
  }

  ngOnInit(): void {
  }

  /** Settings */

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {height: "80%", width: "40%", disableClose: true});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.changeState(1);
        this.simulationConfiguration = new SimulationConfiguration().initialize(res);
        this.initSimulation(this.simulationConfiguration);
        this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar');
      }
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
    });
  }

  /** Simulation */

  initSimulation(configuration: SimulationConfiguration): void {
    const container = document.getElementById('vis-container');

    this.network = this.visService.initGraphFromConfig(configuration, container, {});
  }

  /** Helper Methods */

  changeState(state: number): void {
    this.simulationState = this.states[state];
    this.simulationStateDate = new Date();
  }

}
