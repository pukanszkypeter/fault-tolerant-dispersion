import {Component, Inject, OnInit} from '@angular/core';
import {algorithmTypes} from "../../../models/types/AlgorithmType";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Color, getColorByHex} from "../../../models/others/Colors";

@Component({
  selector: 'app-algorithm-configuration',
  templateUrl: './algorithm-configuration.component.html',
  styleUrls: ['./algorithm-configuration.component.css']
})
export class AlgorithmConfigurationComponent implements OnInit {

  algorithmTypes = algorithmTypes;

  settingsFormGroup: FormGroup;

  keys: string[] = [];
  map: Map<string, number[]>;

  getColorByHex = getColorByHex;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              fb: FormBuilder,
              public dialogRef: MatDialogRef<AlgorithmConfigurationComponent>) {

    this.settingsFormGroup = fb.group({
      algorithmType: new FormControl('', Validators.required),
      robots: new FormControl(1, [Validators.min(1), Validators.max(this.data.robotLimit), Validators.required])
    });

    this.map = data.startNodes;
    for (let [key, values] of this.map) {
      this.keys.push(key);
      this.settingsFormGroup.addControl(key, new FormControl('', Validators.required));
    }

  }

  ngOnInit(): void {
  }

  save() {
    let startNodes = new Map<string, number[]>();
    for (let key of this.keys) {
      startNodes.set(key, this.getKey(key).value);
    }

    this.dialogRef.close({
      algorithmType: this.algorithmType.value,
      robots: this.robots.value,
      startNodes: startNodes
    });
  }

  /** Form Controls */

  get algorithmType(): FormControl {
    return this.settingsFormGroup.controls['algorithmType'] as FormControl;
  }

  get robots(): FormControl {
    return this.settingsFormGroup.controls['robots'] as FormControl;
  }

  getKey(key: string): FormControl {
    return this.settingsFormGroup.controls[key] as FormControl;
  }

}
