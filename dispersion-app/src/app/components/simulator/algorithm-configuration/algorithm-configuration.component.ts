import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RandomDispersionRobot } from 'src/app/models/algorithms/random-dispersion/RandomDispersionRobot';
import { RandomWithLeaderDispersionRobot } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionRobot';
import { RotorRouterDispersionRobot } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionRobot';
import { RotorRouterWithLeaderDispersionRobot } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionRobot';
import { Robot } from 'src/app/models/core/Robot';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';
import { getColorByHex } from 'src/app/models/utils/Color';
import { RobotState } from 'src/app/models/utils/RobotState';
import { VisService } from 'src/app/services/client-side/vis/vis.service';

@Component({
  selector: 'app-algorithm-configuration',
  templateUrl: './algorithm-configuration.component.html',
  styleUrls: ['./algorithm-configuration.component.css']
})
export class AlgorithmConfigurationComponent {

  algorithmTypes = Object.keys(AlgorithmType);

  getColorByHex = getColorByHex;

  settingsFormGroup: FormGroup;

  keys: string[] = [];
  map: Map<string, number[]>;

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
      this.settingsFormGroup.addControl(key + 'startNodes', new FormControl('', Validators.required));
    }

  }

  ngOnInit(): void {
  }

  save() {
    let robots = [];

    let robotID = 1;
    for (let key of this.keys) {
      const startNodes = this.getStartNodeKey(key).value;

      const distribution = this.visService.balance(this.map.get(key).length, startNodes.length);

      for (let i = 0; i < startNodes.length; i++) {
        for (let j = 0; j < distribution[i]; j++) {
          switch (this.algorithmType.value) {
            case AlgorithmType.RANDOM_DISPERSION:
              robots.push(new RandomDispersionRobot(robotID, RobotState.START, getColorByHex(key), startNodes[i], null));
              break;
            case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
              robots.push(new RandomWithLeaderDispersionRobot(robotID, RobotState.START, getColorByHex(key), startNodes[i], null));
              break;
            case AlgorithmType.ROTOR_ROUTER_DISPERSION:
              robots.push(new RotorRouterDispersionRobot(robotID, RobotState.START, getColorByHex(key), startNodes[i], null));
              break;
            case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
              robots.push(new RotorRouterWithLeaderDispersionRobot(robotID, RobotState.START, getColorByHex(key), startNodes[i], null, null));
              break;
            default:
              throw new Error('Algorithm type not found!');
          }
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