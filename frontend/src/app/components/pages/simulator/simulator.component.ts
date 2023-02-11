import { CdkDrag, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { map, Observable } from "rxjs";
import { VisService } from "src/app/services/client/vis.service";
import { BreakpointService } from "src/app/services/utils/breakpoint.service";
import { GraphConfigDialogComponent } from "./graph-config-dialog/graph-config-dialog.component";

@Component({
  selector: "app-simulator",
  templateUrl: "./simulator.component.html",
  styleUrls: ["./simulator.component.scss"],
})
export class SimulatorComponent {
  breakpoint$: Observable<string> = this.breakpoint.breakpoint$;

  // Operators

  operator: CdkDrag[] = [];
  @ViewChildren(CdkDrag)
  operators!: QueryList<CdkDrag>;

  constructor(
    public dialog: MatDialog,
    private breakpoint: BreakpointService,
    private cdr: ChangeDetectorRef,
    private vis: VisService
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

  openGraphConfigDialog(): void {
    const dialogRef = this.dialog.open(GraphConfigDialogComponent, {
      minWidth: "500px",
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const container = document.getElementById("visContainer");
      if (result && container) {
        this.vis.drawGraph(result.topology, result.props, container).subscribe({
          next(value) {
            // console.log(value);
          },
          error(err) {
            console.log(err);
          },
        });
      }
    });
  }
}
