import { Component } from "@angular/core";
import {
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
      startNodes: new FormControl([], [Validators.required]),
      distribution: new FormControl(true, []),
    });
    this.nodes = this.simulator.graph.nodes
      .map((node: Node) => node.id)
      .sort((a, b) => a - b);
  }

  get type(): FormControl {
    return this.algorithmConfigForm.get("type") as FormControl;
  }

  startNodeSelected(): void {
    // Delete
    Object.keys(this.algorithmConfigForm.controls)
      .filter(
        (key) => key !== "type" && key !== "startNodes" && key != "distribution"
      )
      .forEach((key) => this.algorithmConfigForm.removeControl(key));
    // Push
    const distribution = this.util.distributeAll(
      this.nodes.length,
      this.startNodes.value.length
    );
    this.distribution.setValue(true);
    this.startNodes.value.forEach((node: string, index: number) => {
      this.algorithmConfigForm.addControl(
        node,
        new FormControl(
          { value: distribution[index], disabled: true },
          { nonNullable: true, validators: [Validators.required] }
        )
      );
    });
  }

  get startNodes(): FormControl {
    return this.algorithmConfigForm.get("startNodes") as FormControl;
  }

  distributionToggle(): void {
    Object.keys(this.algorithmConfigForm.controls)
      .filter(
        (key) => key !== "type" && key !== "startNodes" && key != "distribution"
      )
      .forEach((key) => {
        if (this.distribution.value) {
          this.algorithmConfigForm.get(key)?.enable();
        } else {
          this.algorithmConfigForm.get(key)?.reset();
          this.algorithmConfigForm.get(key)?.disable();
        }
      });
  }

  get distribution(): FormControl {
    return this.algorithmConfigForm.get("distribution") as FormControl;
  }

  getNodeControl(startNode: number): FormControl {
    return this.algorithmConfigForm.get(startNode.toString()) as FormControl;
  }

  moreRobotsThenNodes(): boolean {
    const robots = Object.keys(this.algorithmConfigForm.controls)
      .filter(
        (key) => key !== "type" && key !== "startNodes" && key != "distribution"
      )
      .map((key) => this.algorithmConfigForm.get(key)?.value)
      .reduce((sum, current) => sum + current, 0);
    return this.nodes.length < robots;
  }

  saveAlgorithmConfig(): void {
    this.loading.toggle();
    const distribution: { node: number; robots: number }[] = [];
    Object.keys(this.algorithmConfigForm.controls)
      .filter(
        (key) => key !== "type" && key !== "startNodes" && key != "distribution"
      )
      .forEach((key) =>
        distribution.push({
          node: Number(key),
          robots: this.algorithmConfigForm.get(key)?.value,
        })
      );
    this.dialogRef.close({
      type: this.type.value,
      distribution: distribution,
    });
  }

  isAvailableType(type: string): boolean {
    return (
      [
        AlgorithmType.RANDOM,
        AlgorithmType.ROTOR_ROUTER,
        AlgorithmType.FAULTLESS_DFS,
      ].indexOf(type as AlgorithmType) < 0
    );
  }
}
