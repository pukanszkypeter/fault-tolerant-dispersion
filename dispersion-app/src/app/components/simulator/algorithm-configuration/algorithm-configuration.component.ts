import {Component, Inject, OnInit} from '@angular/core';
import {algorithmTypes} from "../../../models/types/AlgorithmType";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {getColorByHex} from "../../../models/others/Colors";
import {VisService} from "../../../services/client-side/vis/vis.service";
import {Robot} from "../../../models/entities/Robot";
import {RobotState} from "../../../models/entities/Robot";

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
              public dialogRef: MatDialogRef<AlgorithmConfigurationComponent>,
              private visService: VisService) {
    this.settingsFormGroup = fb.group({
      algorithmType: new FormControl('', Validators.required),
    });

    this.map = data.startNodes;
    for (let [key] of this.map) {
      this.keys.push(key);
      this.settingsFormGroup.addControl(key+'startNodes', new FormControl('', Validators.required));
    }

  }

  ngOnInit(): void {
  }

  save() {
    let robots: Robot[] = [];

    let robotID = 1;
    for (let key of this.keys) {
      const startNodes = this.getStartNodeKey(key).value;

      const distribution = this.visService.balance(this.map.get(key).length, startNodes.length);

      for (let i = 0; i < startNodes.length; i++) {
        for (let j = 0; j < distribution[i]; j++) {
          robots.push(new Robot(robotID, startNodes[i], RobotState.START, key, null));
          robotID++;
        }
      }
    }

    this.dialogRef.close({
      algorithmType: this.algorithmType.value,
      robots: robots
    });
  }

  /** Form Controls */

  get algorithmType(): FormControl {
    return this.settingsFormGroup.controls['algorithmType'] as FormControl;
  }

  getStartNodeKey(key: string): FormControl {
    return this.settingsFormGroup.controls[key+'startNodes'] as FormControl;
  }

}
