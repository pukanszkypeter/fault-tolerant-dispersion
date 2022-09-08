import { Component, OnInit } from '@angular/core';
import {VisService} from "../../services/client-side/vis/vis.service";
import {GraphConfiguration} from "../simulator/graph-configuration/GraphConfiguration";
import {AlgorithmConfiguration} from "../simulator/algorithm-configuration/AlgorithmConfiguration";
import {SimulationState} from "../../models/base-entities/SimulationState";
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

  testsInProgress = false;
  tests: FormControl = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(1000)]);

  testRatio: number = 0;
  stepsList: number[] = [];
  serverList: number[] = [];
  summary =  [{tests: 0, success: 0, failed: 0, steps: 0, server: 0}];
  summaryColumns = ['tests', 'success', 'failed', 'steps', 'server'];

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
   this.stepsList = [];
   this.serverList = [];
   this.summary = [{tests: 0, success: 0, failed: 0, steps: 0, server: 0}];
   this.testRatio = 0;
  }

  resetAlgorithm(): void {
    this.algorithmConfiguration = null;
    this.simulationState = null;
    this.stepsList = [];
    this.serverList = [];
    this.summary = [{tests: 0, success: 0, failed: 0, steps: 0, server: 0}];
    this.testRatio = 0;
  }

  run(tests: number): void {
    this.testsInProgress = true;
    if (tests > 0) {
      const start = new Date();
      this.algorithmService.test(this.algorithmConfiguration.algorithmType, this.wrapTestData())
        .subscribe(res => {
          const end = new Date();
          if (res) {
            tests--;
            this.summary[0].tests++;
            this.summary[0].success++;
            this.stepsList.push(res);
            this.summary[0].steps = this.stepsList.reduce((a,b) => a + b, 0) / this.summary[0].tests;
            this.serverList.push(end.valueOf() - start.valueOf());
            this.summary[0].server = this.serverList.reduce((a,b) => a + b, 0) / this.summary[0].tests;
            this.testRatio = Math.ceil((this.summary[0].tests / (tests + this.summary[0].tests)) * 100);
            setTimeout(() => this.run(tests), 500);
          } else {
            tests--;
            this.summary[0].tests++;
            this.summary[0].failed++;
            this.serverList.push(end.valueOf() - start.valueOf());
            this.summary[0].server = this.serverList.reduce((a,b) => a + b, 0) / this.summary[0].tests;
            this.testRatio = Math.ceil((this.summary[0].tests / (tests + this.summary[0].tests)) * 100);
            setTimeout(() => this.run(tests), 500);
          }
        }, err => {
          const end = new Date();
          console.log(err);
          tests--;
          this.summary[0].tests++;
          this.summary[0].failed++;
          this.serverList.push(end.valueOf() - start.valueOf());
          this.summary[0].server = this.serverList.reduce((a,b) => a + b, 0) / this.summary[0].tests;
          this.testRatio = Math.ceil((this.summary[0].tests / (tests + this.summary[0].tests)) * 100);
          setTimeout(() => this.run(tests), 500);
        });
    } else {
      this.testsInProgress = false;
      this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar')
    }
  }

  wrapTestData(): any {
    return {
      algorithmType: this.algorithmConfiguration.algorithmType,
      graphType: this.graphConfiguration.graphType,
      nodes: this.graphConfiguration.nodes,
      robots: this.algorithmConfiguration.robots.length,
      components: this.graphConfiguration.colors.length,
      simulationState: this.simulationState
    }
  }

}
