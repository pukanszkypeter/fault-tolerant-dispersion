import { Component, OnInit } from '@angular/core';
import {VisService} from "../../services/client-side/vis/vis.service";
import {GraphConfiguration} from "../simulator/graph-configuration/GraphConfiguration";
import {AlgorithmConfiguration} from "../simulator/algorithm-configuration/AlgorithmConfiguration";
import {SimulationState} from "../../models/entities/SimulationState";
import {GraphConfigurationComponent} from "../simulator/graph-configuration/graph-configuration.component";
import {MatDialog} from "@angular/material/dialog";
import {SnackbarService} from "../../services/client-side/utils/snackbar.service";
import {AlgorithmConfigurationComponent} from "../simulator/algorithm-configuration/algorithm-configuration.component";
import {FormControl, Validators} from "@angular/forms";
import {AlgorithmService} from "../../services/server-side/algorithms/algorithm.service";

@Component({
  selector: 'app-automated-test',
  templateUrl: './automated-tester.component.html',
  styleUrls: ['./automated-tester.component.css']
})
export class AutomatedTesterComponent implements OnInit {

  graphConfiguration: GraphConfiguration;
  algorithmConfiguration: AlgorithmConfiguration;

  simulationState: SimulationState;

  tests: FormControl = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(1000)]);

  constructor(private snackBarService: SnackbarService,
              private visService: VisService,
              private algorithmService: AlgorithmService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  configureGraph(): void {
    this.resetGraph();
    const dialogRef = this.dialog.open(GraphConfigurationComponent, {data: {automatedMode: true}, height: "50%", width: "30%", disableClose: true});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.graphConfiguration = new GraphConfiguration().initialize(res);
        this.visService.initDataFromConfig(this.graphConfiguration);
        this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar');
      }
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
    });
  }

  configureAlgorithm(): void {
    this.resetAlgorithm();
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
        this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar');
      }
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('FORM_ERROR', 'error-snackbar');
    });
  }

  resetGraph(): void {
   this.graphConfiguration = null;
   this.algorithmConfiguration = null;
   this.simulationState = null;
  }

  resetAlgorithm(): void {
    this.algorithmConfiguration = null;
    this.simulationState = null;
  }

  run(): void {
    this.algorithmService.test(this.algorithmConfiguration.algorithmType, this.wrapTestData())
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
  }

  wrapTestData(): any {
    return {
      algorithmType: this.algorithmConfiguration.algorithmType,
      graphType: this.graphConfiguration.graphType,
      nodes: this.graphConfiguration.nodes,
      robots: this.algorithmConfiguration.robots.length,
      components: this.graphConfiguration.colors.length,
      tests: this.tests.value,
      simulationState: this.simulationState
    }
  }

}
