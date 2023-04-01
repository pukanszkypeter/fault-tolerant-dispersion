import { Component, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { delay, firstValueFrom } from "rxjs";
import { AlgorithmType } from "src/app/models/algorithm/AlgorithmType";
import { Robot } from "src/app/models/algorithm/Robot";
import { DispersionType } from "src/app/models/fault/DispersionType";
import { Edge } from "src/app/models/graph/Edge";
import { Graph } from "src/app/models/graph/Graph";
import { GraphType } from "src/app/models/graph/GraphType";
import { Node } from "src/app/models/graph/Node";
import { NodeState } from "src/app/models/graph/NodeState";
import { Batch } from "src/app/models/test/Batch";
import { SnackBarType } from "src/app/models/utils/SnackBar";
import { LoadingService } from "src/app/services/client/loading.service";
import { SimulatorService } from "src/app/services/client/simulator.service";
import { SnackBarService } from "src/app/services/client/snack-bar.service";
import { UtilService } from "src/app/services/client/util.service";
import { GraphService } from "src/app/services/server/graph.service";
import { ResultService } from "src/app/services/server/result.service";
import { TestService } from "src/app/services/server/test.service";
import { AlgorithmConfigDialogComponent } from "../simulator/algorithm-config-dialog/algorithm-config-dialog.component";
import { FaultsConfigDialogComponent } from "../simulator/faults-config-dialog/faults-config-dialog.component";
import { GraphConfigDialogComponent } from "../simulator/graph-config-dialog/graph-config-dialog.component";

export interface BatchTableRow {
  no: number;
  graphType: GraphType;
  algorithmType: AlgorithmType;
  dispersionType: DispersionType;
  graph: Graph;
  robots: Robot[];
  teams: number;
  faultLimit: number;
  faultProbability: number;
  numOfTests: number;
  avgCrashes: number;
  avgStep: number;
  progress: number;
}

@Component({
  selector: "app-tester",
  templateUrl: "./tester.component.html",
  styleUrls: ["./tester.component.scss"],
})
export class TesterComponent {
  graphConfigured: boolean = false;
  algorithmConfigured: boolean = false;

  testingFinished: boolean = false;
  timer: NodeJS.Timeout | undefined = undefined;

  numOfTests: FormControl = new FormControl("", [
    Validators.required,
    Validators.min(1),
  ]);

  batches: BatchTableRow[] = [];
  @ViewChild(MatTable) table: MatTable<BatchTableRow> | undefined;
  displayedColumns: string[] = [
    "no",
    "status",
    "graph",
    "algortihm",
    "placement",
    "dispersion",
    "size",
    "faultLimit",
    "faultProbability",
    "numOfTests",
    "avgCrash",
    "avgStep",
    "progress",
  ];

  constructor(
    public dialog: MatDialog,
    private loading: LoadingService,
    private snackBar: SnackBarService,
    private simulator: SimulatorService,
    private graph: GraphService,
    private result: ResultService,
    private test: TestService,
    private util: UtilService
  ) {}

  handleRefresh(): void {
    this.graphConfigured = false;
    this.algorithmConfigured = false;
    this.numOfTests.reset();
  }

  addBatchTest(): void {
    console.log(this.simulator.teams);
    this.batches.push({
      no: this.batches.length + 1,
      graphType: this.simulator.graphType!,
      algorithmType: this.simulator.algorithmType!,
      dispersionType: this.simulator.dispersionType!,
      graph: this.simulator.graph,
      robots: this.simulator.robots.getValue(),
      teams: this.simulator.teams,
      faultLimit: this.simulator.faultLimit!,
      faultProbability: this.simulator.faultProbability!,
      numOfTests: this.numOfTests.value,
      avgCrashes: 0,
      avgStep: 0,
      progress: 0,
    });
    if (this.table) {
      this.table.renderRows();
    }
  }

  // Test

  async runTests(): Promise<void> {
    this.loading.toggle();
    this.testingFinished = false;
    const batch = await firstValueFrom(
      this.test.getBatch(this.numOfTests.value)
    );
    this.snackBar.openSnackBar("tester.batchInProgress", SnackBarType.INFO);
    this.getLatestResults(batch);
    this.test
      .test({
        graphType: this.simulator.graphType!,
        graph: this.simulator.graph,
        algorithmType: this.simulator.algorithmType!,
        robots: this.simulator.robots.getValue(),
        numOfTests: this.numOfTests.value,
      })
      .pipe(delay(5000))
      .subscribe({
        next: (_response) => {
          this.snackBar.openSnackBar(
            "tester.batchFinished",
            SnackBarType.SUCCESS
          );
          this.testingFinished = true;
        },
        error: (error) => {
          console.log(error);
          this.snackBar.openSnackBar("app.serverError", SnackBarType.ERROR);
          this.testingFinished = true;
        },
      });
  }

  async getLatestResults(batch: Batch): Promise<void> {
    let currentId = batch.startId - 1;
    let endId = batch.endId;
    while (!this.testingFinished || currentId !== endId) {
      const results = await firstValueFrom(this.result.getLatests(currentId));
      if (results.length > 0) {
        currentId = results[results.length - 1].id!;
        console.log(results);
      }
      await this.sleep(5000);
    }
    this.loading.toggle();
  }

  sleep(ms: number): Promise<void> {
    return new Promise((r) => {
      this.timer = setTimeout(r, ms);
    });
  }

  // Dialogs

  openGraphConfigDialog(): void {
    const dialogRef = this.dialog.open(GraphConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.toggle();
        this.graph.generate(result.topology, result.props).subscribe({
          next: (response) => {
            const graph = response;
            this.simulator.graph.nodes = [];
            this.simulator.graph.edges = [];
            graph.nodes.forEach((node: Node) =>
              this.simulator.graph.nodes.push(node)
            );
            graph.edges.forEach((edge: Edge) =>
              this.simulator.graph.edges.push(edge)
            );
            this.graphConfigured = true;
            this.algorithmConfigured = false;
            this.simulator.graphType = result.topology;
            this.simulator.algorithmType = undefined;
            this.snackBar.openSnackBar(
              "simulator.graphConfig.successfulGraph",
              SnackBarType.SUCCESS
            );
            this.loading.toggle();
          },
          error: (error) => {
            console.log(error);
            this.snackBar.openSnackBar(
              "simulator.graphConfig.unsuccessfulGraph",
              SnackBarType.ERROR
            );
            this.loading.toggle();
          },
        });
      }
    });
  }

  openAlgorithmConfigDialog(): void {
    const dialogRef = this.dialog.open(AlgorithmConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.algorithmConfigured = true;
        this.simulator.teams = result.distribution.length;
        this.simulator.algorithmType = result.type;
        this.simulator.populate(result.distribution);
        this.snackBar.openSnackBar(
          "simulator.algorithmConfig.successfulAlgorithm",
          SnackBarType.SUCCESS
        );
        this.loading.toggle();
      }
    });
  }

  openFaultsConfigDialog(): void {
    const dialogRef = this.dialog.open(FaultsConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.simulator.faultLimit = result.faultLimit;
        this.simulator.faultProbability = result.faultProbability;
        this.simulator.dispersionType = result.dispersionType;
        if (result.dispersionType === DispersionType.COMPLETE) {
          const startNodes = this.simulator.graph.nodes.filter(
            (node) => node.state === NodeState.PENDING
          );
          const distribution = this.util.distributeAll(
            this.simulator.robots.getValue().length + result.faultLimit,
            startNodes.length
          );
          if (startNodes.length === distribution.length) {
            this.simulator.populate(
              startNodes.map((value, index) => {
                return { node: value.id, robots: distribution[index] };
              }) as any
            );
          }
        }
        this.snackBar.openSnackBar(
          "simulator.faultsConfig.successfulFaults",
          SnackBarType.SUCCESS
        );
        this.loading.toggle();
      }
    });
  }
}
