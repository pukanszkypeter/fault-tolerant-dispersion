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
import { NodeState } from "src/app/models/graph/NodeState";
import { LoadingService } from "src/app/services/client/loading.service";
import { SimulatorService } from "src/app/services/client/simulator.service";

@Component({
  selector: "app-faults-config-dialog",
  templateUrl: "./faults-config-dialog.component.html",
  styleUrls: ["./faults-config-dialog.component.scss"],
})
export class FaultsConfigDialogComponent {
  darkMode$: Observable<boolean> = this.darkMode.darkMode$;
  faultsConfigForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<FaultsConfigDialogComponent>,
    private darkMode: DarkModeService,
    private simulator: SimulatorService,
    private loading: LoadingService
  ) {
    this.faultsConfigForm = this.fb.group({
      faultLimit: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(this.robotsLength),
      ]),
      faultProbability: new FormControl(0, [
        Validators.required,
        Validators.min(0.1),
        Validators.max(100),
      ]),
      dispersionPurpose: new FormControl("COMPLETE", [Validators.required]),
    });
  }

  get robotsLength(): number {
    return this.simulator.robots.getValue().length;
  }

  get faultLimit(): FormControl {
    return this.faultsConfigForm.get("faultLimit") as FormControl;
  }

  get faultProbability(): FormControl {
    return this.faultsConfigForm.get("faultProbability") as FormControl;
  }

  get dispersionPurpose(): FormControl {
    return this.faultsConfigForm.get("dispersionPurpose") as FormControl;
  }

  get isArbitraryConfig(): boolean {
    return (
      this.simulator.graph.nodes.filter(
        (node) => node.state === NodeState.PENDING
      ).length > 1
    );
  }

  increaseProbability(): void {
    const p = (Number(this.faultProbability.value) + 0.1).toFixed(1);
    this.faultProbability.setValue(p);
  }

  decreaseProbability(): void {
    const p = (Number(this.faultProbability.value) - 0.1).toFixed(1);
    this.faultProbability.setValue(p);
  }

  saveFaultsConfig() {
    this.loading.toggle();
    this.dialogRef.close({
      faultLimit: this.faultLimit.value,
      faultProbability: this.faultProbability.value,
      dispersionType: this.dispersionPurpose.value,
    });
  }
}
