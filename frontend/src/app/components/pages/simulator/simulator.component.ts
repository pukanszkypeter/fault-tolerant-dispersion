import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { delay, firstValueFrom, map, Observable } from "rxjs";
import { VisService } from "app/services/client/vis.service";
import { BreakpointService } from "app/services/client/breakpoint.service";
import { GraphConfigDialogComponent } from "./graph-config-dialog/graph-config-dialog.component";
import { LoadingService } from "app/services/client/loading.service";
import { SnackBarService } from "app/services/client/snack-bar.service";
import { SnackBarType } from "app/models/utils/SnackBar";
import { AlgorithmConfigDialogComponent } from "./algorithm-config-dialog/algorithm-config-dialog.component";
import { SimulatorService } from "app/services/client/simulator.service";
import { MatTableDataSource } from "@angular/material/table";
import { Robot } from "app/models/algorithm/Robot";
import { MatPaginator } from "@angular/material/paginator";
import { NodeState } from "app/models/graph/NodeState";
import { SettingsConfigDialogComponent } from "./settings-config-dialog/settings-config-dialog.component";
import { FaultsConfigDialogComponent } from "./faults-config-dialog/faults-config-dialog.component";
import { DispersionType } from "app/models/fault/DispersionType";
import { UtilService } from "app/services/client/util.service";

@Component({
  selector: "app-simulator",
  templateUrl: "./simulator.component.html",
  styleUrls: ["./simulator.component.scss"],
})
export class SimulatorComponent {
  breakpoint$: Observable<string> = this.breakpoint.breakpoint$;

  graphConfigured: boolean = false;
  algorithmConfigured: boolean = false;
  faultsConfigured: boolean = false;

  robotColumns: string[] = ["id", "onId", "state"];
  private robotData = new MatTableDataSource<Robot>();
  robotData$: Observable<MatTableDataSource<Robot>> =
    this.simulator.robots.pipe(
      map((robots) => {
        this.robotData.data = robots;
        return this.robotData;
      })
    );
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private breakpoint: BreakpointService,
    private vis: VisService,
    private loading: LoadingService,
    private snackBar: SnackBarService,
    private simulator: SimulatorService,
    private util: UtilService
  ) {}

  ngAfterViewInit() {
    this.robotData.paginator = this.paginator;
  }

  // Dialogs

  openGraphConfigDialog(): void {
    const dialogRef = this.dialog.open(GraphConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const container = document.getElementById("visContainer");
      if (result && container) {
        this.loading.toggle();
        this.vis.drawGraph(result.topology, result.props, container).subscribe({
          next: (_response) => {
            this.snackBar.openSnackBar(
              "simulator.graphConfig.successfulGraph",
              SnackBarType.SUCCESS
            );
            this.simulator.graphType = result.topology;
            this.simulator.algorithmType = undefined;
            this.graphConfigured = true;
            this.algorithmConfigured = false;
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
    if (this.graphConfigured) {
      const dialogRef = this.dialog.open(AlgorithmConfigDialogComponent, {
        minWidth: "500px",
        width: "600px",
        disableClose: true,
        autoFocus: false,
      });

      dialogRef
        .afterClosed()
        .pipe(delay(1000))
        .subscribe((result) => {
          if (result) {
            this.algorithmConfigured = true;
            this.simulator.teams = result.distribution.length;
            this.simulator.algorithmType = result.type;
            this.simulator.populate(result.distribution);
            this.vis.updateGraph().subscribe();
            this.snackBar.openSnackBar(
              "simulator.algorithmConfig.successfulAlgorithm",
              SnackBarType.SUCCESS
            );
            this.loading.toggle();
          }
        });
    } else {
      this.snackBar.openSnackBar("app.notAvailable", SnackBarType.WARNING);
    }
  }

  openSettingsConfigDialog(): void {
    if (!this.isRunning) {
      this.dialog.open(SettingsConfigDialogComponent, {
        data: { faultsConfigured: this.faultsConfigured },
        width: "500px",
        disableClose: true,
        autoFocus: false,
      });
    }
  }

  openFaultsConfigDialog(): void {
    if (this.graphConfigured && this.algorithmConfigured) {
      const dialogRef = this.dialog.open(FaultsConfigDialogComponent, {
        minWidth: "500px",
        width: "600px",
        disableClose: true,
        autoFocus: false,
      });

      dialogRef
        .afterClosed()
        .pipe(delay(1000))
        .subscribe((result) => {
          if (result) {
            this.faultsConfigured = true;
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
    } else {
      this.snackBar.openSnackBar("app.notAvailable", SnackBarType.WARNING);
    }
  }

  // Simulator

  async play(): Promise<void> {
    if (
      this.graphConfigured &&
      this.algorithmConfigured &&
      (this.simulateFaults ? this.faultsConfigured : true)
    ) {
      this.simulator.play([() => firstValueFrom(this.vis.updateGraph())]);
    } else {
      this.snackBar.openSnackBar("app.notAvailable", SnackBarType.WARNING);
    }
  }

  async next(): Promise<void> {
    if (
      this.graphConfigured &&
      this.algorithmConfigured &&
      !this.isRunning &&
      (this.simulateFaults ? this.faultsConfigured : true)
    ) {
      this.simulator.next([() => firstValueFrom(this.vis.updateGraph())]);
    } else {
      this.snackBar.openSnackBar("app.notAvailable", SnackBarType.WARNING);
    }
  }

  stop(): void {
    this.simulator.stop();
  }

  async reset(): Promise<void> {
    const loading = await firstValueFrom(this.loading.loading$);
    if (this.graphConfigured && !this.isRunning && !loading) {
      this.simulator.reset();
      this.vis.destoryGraph();
      this.algorithmConfigured = false;
      this.graphConfigured = false;
      this.faultsConfigured = false;
      this.snackBar.openSnackBar(
        "simulator.resetSucceeded",
        SnackBarType.SUCCESS
      );
    } else {
      this.snackBar.openSnackBar("app.notAvailable", SnackBarType.WARNING);
    }
  }

  // Getters

  get simulatorProps(): SimulatorService {
    return this.simulator;
  }

  get isRunning(): boolean {
    return this.simulator.running;
  }

  get simulationState(): string {
    return this.simulator.state;
  }

  get steps(): number {
    return this.simulator.step;
  }

  get getOccupancy(): string {
    return this.graphConfigured && this.algorithmConfigured
      ? Math.round(
          (this.simulator.graph.nodes.filter(
            (node) => node.state === NodeState.OCCUPIED
          ).length /
            this.simulator.graph.nodes.length) *
            100
        ).toFixed(2)
      : "0.00";
  }

  get showInformations(): boolean {
    return this.simulator.showInformations;
  }

  get simulateFaults(): boolean {
    return this.simulator.simulateFaults;
  }

  get isSmallScreen$(): Observable<boolean> {
    return this.breakpoint$.pipe(
      map((breakpoint) => {
        return breakpoint === "XS" || breakpoint === "S" || breakpoint === "M";
      })
    );
  }
}
