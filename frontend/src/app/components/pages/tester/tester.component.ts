import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { delay, firstValueFrom } from "rxjs";
import { Edge } from "src/app/models/graph/Edge";
import { Node } from "src/app/models/graph/Node";
import { Batch } from "src/app/models/simulation/Batch";
import { SnackBarType } from "src/app/models/utils/SnackBar";
import { LoadingService } from "src/app/services/client/loading.service";
import { SimulatorService } from "src/app/services/client/simulator.service";
import { SnackBarService } from "src/app/services/client/snack-bar.service";
import { GraphService } from "src/app/services/server/graph.service";
import { ResultService } from "src/app/services/server/result.service";
import { TestService } from "src/app/services/server/test.service";
import { AlgorithmConfigDialogComponent } from "../simulator/algorithm-config-dialog/algorithm-config-dialog.component";
import { GraphConfigDialogComponent } from "../simulator/graph-config-dialog/graph-config-dialog.component";

@Component({
  selector: "app-tester",
  templateUrl: "./tester.component.html",
  styleUrls: ["./tester.component.scss"],
})
export class TesterComponent {
  graphConfigured: boolean = false;
  algorithmConfigured: boolean = false;
  testingFinished: boolean = false;

  numOfTests: FormControl = new FormControl("", [
    Validators.required,
    Validators.min(1),
  ]);

  constructor(
    public dialog: MatDialog,
    private loading: LoadingService,
    private snackBar: SnackBarService,
    private simulator: SimulatorService,
    private graph: GraphService,
    private result: ResultService,
    private test: TestService
  ) {}

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
        console.log(results);
        currentId = results[results.length - 1].id!;
      }
      await this.sleep(10000);
    }
    this.loading.toggle();
  }

  sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
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

    dialogRef
      .afterClosed()
      .pipe(delay(500))
      .subscribe((result) => {
        if (result) {
          this.algorithmConfigured = true;
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
}
