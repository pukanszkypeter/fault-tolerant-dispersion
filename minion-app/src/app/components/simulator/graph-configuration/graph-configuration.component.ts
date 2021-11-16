import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {graphTypes, hasNodeValueConstraint} from "../../../models/types/GraphType";
import {colors} from "../../../models/others/Colors";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './graph-configuration.html',
  styleUrls: ['./graph-configuration.component.css']
})
export class GraphConfigurationComponent implements OnInit {

  graphTypes = graphTypes;
  colorTypes = colors;

  settingsFormGroup: FormGroup;

  constructor(fb: FormBuilder, public dialogRef: MatDialogRef<GraphConfigurationComponent>) {
    this.settingsFormGroup = fb.group({
      graphType: new FormControl('', Validators.required),
      nodes: new FormControl(1, [Validators.min(1), Validators.max(50), Validators.required]),
      colors: new FormControl('', Validators.required)
    });

    this.graphType.valueChanges.subscribe(res => {
      hasNodeValueConstraint(res, this.nodes);
    });

  }

  ngOnInit(): void {
  }

  save() {
    this.dialogRef.close({
      graphType: this.graphType.value,
      nodes: this.nodes.value,
      colors: this.colors.value
    });
  }

  /** Form Controls */

  get graphType(): FormControl {
    return this.settingsFormGroup.controls['graphType'] as FormControl;
  }

  get nodes(): FormControl {
    return this.settingsFormGroup.controls['nodes'] as FormControl;
  }

  get colors(): FormControl {
    return this.settingsFormGroup.controls['colors'] as FormControl;
  }

}
