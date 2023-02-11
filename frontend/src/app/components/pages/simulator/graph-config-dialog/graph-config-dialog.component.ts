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
import { graphSettings } from "src/app/models/graph/GraphSettings";
import { GraphType, WindmillMode } from "src/app/models/graph/GraphType";

@Component({
  selector: "app-graph-config-dialog",
  templateUrl: "./graph-config-dialog.component.html",
  styleUrls: ["./graph-config-dialog.component.scss"],
})
export class GraphConfigDialogComponent {
  darkMode$: Observable<boolean> = this.darkMode.darkMode$;
  graphTypes = Object.keys(GraphType);
  windmillModes = Object.keys(WindmillMode);
  graphConfigForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<GraphConfigDialogComponent>,
    private darkMode: DarkModeService
  ) {
    this.graphConfigForm = this.fb.group({
      topology: new FormControl("", Validators.required),
      defaultSetting: new FormControl(true),
    });
  }

  topologySelect(): void {
    Object.keys(this.graphConfigForm.controls).forEach((key) => {
      if (key !== "topology" && key !== "defaultSetting") {
        this.graphConfigForm.removeControl(key);
      }
    });
    if (this.topology.value) {
      this.defaultSetting.setValue(true);
      Object.entries(graphSettings[this.topology.value as GraphType]).forEach(
        ([key, value]) => {
          this.graphConfigForm.addControl(key, value);
          this.graphConfigForm.get(key)?.reset();
          this.graphConfigForm.get(key)?.disable();
        }
      );
    }
  }

  get topology(): FormControl {
    return this.graphConfigForm.get("topology") as FormControl;
  }

  defaultSettingToggle(): void {
    Object.keys(this.graphConfigForm.controls).forEach((key) => {
      if (key !== "topology" && key !== "defaultSetting") {
        if (!this.defaultSetting.value) {
          this.graphConfigForm.get(key)?.reset();
          this.graphConfigForm.get(key)?.disable();
        } else {
          this.graphConfigForm.get(key)?.enable();
        }
      }
    });
  }

  get defaultSetting(): FormControl {
    return this.graphConfigForm.get("defaultSetting") as FormControl;
  }

  getGraphTypeControl(index: number): FormControl {
    return Object.entries(graphSettings[this.topology.value as GraphType])[
      index
    ][1];
  }

  saveGraphConfig(): void {
    let props: { key: string; value: any }[] = [];
    Object.entries(this.graphConfigForm.controls).forEach(([key, value]) => {
      if (key !== "defaultSetting" && key !== "topology") {
        props.push({ key: key, value: value.value });
      }
    });
    this.dialogRef.close({
      topology: this.topology.value,
      props: props,
    });
  }
}
