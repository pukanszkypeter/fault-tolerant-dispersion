import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {graphTypes, hasNodeValueConstraint} from "../../../models/types/GraphType";
import {algorithmTypes} from "../../../models/types/AlgorithmType";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  graphTypes = graphTypes;
  algorithmTypes = algorithmTypes;

  numberOfNodes = [1];

  settingsFormGroup: FormGroup;

  constructor(fb: FormBuilder, public dialogRef: MatDialogRef<SettingsDialogComponent>) {
    this.settingsFormGroup = fb.group({
      algorithmType: new FormControl('', Validators.required),
      graphType: new FormControl('', Validators.required),
      nodes: new FormControl(1, [Validators.min(1), Validators.max(50), Validators.required]),
      robots: new FormControl(1, [Validators.min(1), Validators.max(50), Validators.required]),
      colors: new FormControl(1, [Validators.min(1), Validators.max(10), Validators.required]),
      startNodes: new FormControl([1], Validators.required)
    });

    this.nodes.valueChanges.subscribe(res => {
      if (res && Number(res) >= 1 && Number(res) <= 50) {
        const number = Number(res);
        this.numberOfNodes = [];
        this.startNodes.setValue([]);
        for (let i = 1; i <= number; i++) {
          this.numberOfNodes.push(i);
        }
      }
    });

    this.graphType.valueChanges.subscribe(res => {
      hasNodeValueConstraint(res, this.nodes);
    });

  }

  ngOnInit(): void {
  }

  save() {
    this.dialogRef.close({
      algorithmType: this.algorithmType.value,
      graphType: this.graphType.value,
      nodes: this.nodes.value,
      robots: this.robots.value,
      colors: this.colors.value,
      startNodes: this.startNodes.value
    });
  }

  /** Form Controls */

  get algorithmType(): FormControl {
    return this.settingsFormGroup.controls['algorithmType'] as FormControl;
  }

  get graphType(): FormControl {
    return this.settingsFormGroup.controls['graphType'] as FormControl;
  }

  get nodes(): FormControl {
    return this.settingsFormGroup.controls['nodes'] as FormControl;
  }

  get robots(): FormControl {
    return this.settingsFormGroup.controls['robots'] as FormControl;
  }

  get colors(): FormControl {
    return this.settingsFormGroup.controls['colors'] as FormControl;
  }

  get startNodes(): FormControl {
    return this.settingsFormGroup.controls['startNodes'] as FormControl;
  }

}
