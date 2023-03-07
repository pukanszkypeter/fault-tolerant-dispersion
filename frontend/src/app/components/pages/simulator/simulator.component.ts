import { CdkDrag, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { delay, firstValueFrom, map, Observable } from "rxjs";
import { VisService } from "src/app/services/client/vis.service";
import { BreakpointService } from "src/app/services/client/breakpoint.service";
import { GraphConfigDialogComponent } from "./graph-config-dialog/graph-config-dialog.component";
import { LoadingService } from "src/app/services/client/loading.service";
import { SnackBarService } from "src/app/services/client/snack-bar.service";
import { SnackBarType } from "src/app/models/utils/SnackBar";
import { AlgorithmConfigDialogComponent } from "./algorithm-config-dialog/algorithm-config-dialog.component";
import { SimulatorService } from "src/app/services/client/simulator.service";
import { MatTableDataSource } from "@angular/material/table";
import { Robot } from "src/app/models/algorithm/Robot";
import { MatPaginator } from "@angular/material/paginator";
import { NodeState } from "src/app/models/graph/NodeState";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-simulator",
  templateUrl: "./simulator.component.html",
  styleUrls: ["./simulator.component.scss"],
})
export class SimulatorComponent {
  breakpoint$: Observable<string> = this.breakpoint.breakpoint$;
  graphConfigured: boolean = false;
  algorithmConfigured: boolean = false;

  // Operators

  operator: CdkDrag[] = [];
  @ViewChildren(CdkDrag)
  operators!: QueryList<CdkDrag>;

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
    private cdr: ChangeDetectorRef,
    private vis: VisService,
    private loading: LoadingService,
    private snackBar: SnackBarService,
    private simulator: SimulatorService
  ) {}

  get isSmallScreen$(): Observable<boolean> {
    return this.breakpoint$.pipe(
      map((breakpoint) => {
        return (
          breakpoint === "XS" ||
          breakpoint === "S" ||
          breakpoint === "M" ||
          breakpoint === "L"
        );
      })
    );
  }

  get isExtraSmallScreen$(): Observable<boolean> {
    return this.breakpoint$.pipe(
      map((breakpoint) => {
        return breakpoint === "XS" || breakpoint === "S";
      })
    );
  }

  // Operators

  ngAfterViewInit() {
    const arr = this.operators.toArray();
    this.operator = [arr[0], arr[1], arr[2], arr[3]];
    this.robotData.paginator = this.paginator;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  drop(event: CdkDragDrop<any[]>) {
    const { container, previousIndex, currentIndex } = event;

    moveItemInArray(container.data, previousIndex, currentIndex);
    this.moveWithinContainer(
      container.element.nativeElement,
      previousIndex,
      currentIndex
    );
  }

  moveWithinContainer(
    container: any,
    fromIndex: number,
    toIndex: number
  ): void {
    if (fromIndex === toIndex) {
      return;
    }

    const nodeToMove = container.children[fromIndex];
    const targetNode = container.children[toIndex];

    if (fromIndex < toIndex) {
      targetNode.parentNode.insertBefore(nodeToMove, targetNode.nextSibling);
    } else {
      targetNode.parentNode.insertBefore(nodeToMove, targetNode);
    }
  }

  get saveResults(): boolean {
    return this.simulator.saveResults;
  }

  toggleSaveResults(event: MatCheckboxChange) {
    this.simulator.toggleSaveResults(event.checked);
  }

  // Dialogs

  openGraphConfigDialog(): void {
    const dialogRef = this.dialog.open(GraphConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
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
    const dialogRef = this.dialog.open(AlgorithmConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(delay(1000))
      .subscribe((result) => {
        if (result) {
          this.algorithmConfigured = true;
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
  }

  // Simulator

  async play(): Promise<void> {
    return this.simulator.play([() => firstValueFrom(this.vis.updateGraph())]);
  }

  async next(): Promise<void> {
    return this.simulator.next([() => firstValueFrom(this.vis.updateGraph())]);
  }

  stop(): void {
    this.simulator.stop();
  }

  get isRunning(): boolean {
    return this.simulator.running;
  }

  get simulationState(): string {
    return this.simulator.state;
  }

  get delay(): number {
    return this.simulator.delay;
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

  increaseDelay(): void {
    this.simulator.increaseDelay();
  }

  decreaseDelay(): void {
    this.simulator.decreaseDelay();
  }

  async reset(): Promise<void> {
    this.loading.toggle();
    this.simulator.stop();
    this.snackBar.openSnackBar("simulator.waitingForApi", SnackBarType.INFO);
    setTimeout(() => {
      this.simulator.reset();
      this.vis.destoryGraph();
      this.algorithmConfigured = false;
      this.graphConfigured = false;
      this.snackBar.openSnackBar(
        "simulator.resetSucceeded",
        SnackBarType.SUCCESS
      );
      this.loading.toggle();
    }, 5000);
  }
}
