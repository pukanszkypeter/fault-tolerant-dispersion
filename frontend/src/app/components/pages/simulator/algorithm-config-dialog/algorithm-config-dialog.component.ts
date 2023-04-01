import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { DarkModeService } from "angular-dark-mode";
import { Observable } from "rxjs";
import { AlgorithmType } from "src/app/models/algorithm/AlgorithmType";
import { Node } from "src/app/models/graph/Node";
import { LoadingService } from "src/app/services/client/loading.service";
import { SimulatorService } from "src/app/services/client/simulator.service";
import { UtilService } from "src/app/services/client/util.service";

@Component({
  selector: "app-algorithm-config-dialog",
  templateUrl: "./algorithm-config-dialog.component.html",
  styleUrls: ["./algorithm-config-dialog.component.scss"],
})
export class AlgorithmConfigDialogComponent {
  darkMode$: Observable<boolean> = this.darkMode.darkMode$;
  algorithmTypes = Object.keys(AlgorithmType);
  nodes: number[] = [];
  algorithmConfigForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AlgorithmConfigDialogComponent>,
    private darkMode: DarkModeService,
    private simulator: SimulatorService,
    private util: UtilService,
    private loading: LoadingService
  ) {
    this.algorithmConfigForm = this.fb.group({
      type: new FormControl("", [Validators.required]),
      initalConfig: new FormControl("ROOTED", [Validators.required]),
      startNodes: new FormControl([] || "", [Validators.required]),
      distribution: new FormControl(true, []),
      startNodeCounters: new FormArray([]),
    });
    this.nodes = this.simulator.graph.nodes
      .map((node: Node) => node.id)
      .sort((a, b) => a - b);
  }

  get initalConfig(): FormControl {
    return this.algorithmConfigForm.get("initalConfig") as FormControl;
  }

  get type(): FormControl {
    return this.algorithmConfigForm.get("type") as FormControl;
  }

  get startNodeCounters(): FormArray {
    return this.algorithmConfigForm.get("startNodeCounters") as FormArray;
  }

  get startNodeCounterControls(): FormControl[] {
    return this.startNodeCounters.controls as FormControl[];
  }

  resetCounters(): void {
    this.startNodes.setValue("" || []);
    this.startNodeCounters.clear();
  }

  startNodeSelected(): void {
    // Delete
    this.startNodeCounters.clear();
    // Push
    const distribution = this.util.distributeAll(
      this.nodes.length,
      this.initalConfig.value === "ROOTED" ? 1 : this.startNodes.value.length
    );
    this.distribution.setValue(true);
    if (this.initalConfig.value === "ROOTED") {
      this.startNodeCounters.controls.push(
        new FormControl(
          { value: distribution[0], disabled: true },
          { nonNullable: true, validators: [Validators.required] }
        )
      );
    } else {
      this.startNodes.value.forEach((_node: string, index: number) => {
        this.startNodeCounters.controls.push(
          new FormControl(
            { value: distribution[index], disabled: true },
            { nonNullable: true, validators: [Validators.required] }
          )
        );
      });
    }
  }

  get startNodes(): FormControl {
    return this.algorithmConfigForm.get("startNodes") as FormControl;
  }

  distributionToggle(): void {
    this.startNodeCounterControls.forEach((control) => {
      if (this.distribution.value) {
        control.enable();
      } else {
        control.reset();
        control.disable();
      }
    });
  }

  get distribution(): FormControl {
    return this.algorithmConfigForm.get("distribution") as FormControl;
  }

  getNodeControl(startNode: number): FormControl {
    return this.algorithmConfigForm.get(startNode.toString()) as FormControl;
  }

  invalidRobotSum(): boolean {
    const robots = this.startNodeCounterControls
      .map((control) => control.value)
      .reduce((sum, current) => sum + current, 0);
    return this.nodes.length !== robots;
  }

  saveAlgorithmConfig(): void {
    this.loading.toggle();
    const distribution: { node: number; robots: number }[] = [];
    this.startNodeCounterControls.forEach((control, index) =>
      distribution.push({
        node:
          this.initalConfig.value === "ROOTED"
            ? this.startNodes.value
            : this.startNodes.value[index],
        robots: control.value,
      })
    );
    this.dialogRef.close({
      type: this.type.value,
      distribution: distribution,
    });
  }
}
