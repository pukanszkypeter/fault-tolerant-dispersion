import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FaultlessDfsDispersionRobot } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionRobot';
import { FaultyDfsDispersionRobot } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionRobot';
import { RandomDispersionRobot } from 'src/app/models/algorithms/random-dispersion/RandomDispersionRobot';
import { RandomWithLeaderDispersionRobot } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionRobot';
import { RotorRouterDispersionRobot } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionRobot';
import { RotorRouterWithLeaderDispersionRobot } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionRobot';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';
import { RobotPhase } from 'src/app/models/utils/RobotPhase';
import { RobotState } from 'src/app/models/utils/RobotState';
import { VisService } from 'src/app/services/client-side/vis/vis.service';

@Component({
  selector: 'app-algorithm-configuration',
  templateUrl: './algorithm-configuration.component.html',
  styleUrls: ['./algorithm-configuration.component.css'],
})
export class AlgorithmConfigurationComponent {
  algorithmTypes = Object.keys(AlgorithmType);

  settingsFormGroup: FormGroup;

  nodes: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialogRef: MatDialogRef<AlgorithmConfigurationComponent>,
    private visService: VisService
  ) {
    this.settingsFormGroup = fb.group({
      algorithmType: new FormControl('', Validators.required),
      startNodes: new FormControl('', Validators.required),
    });

    this.nodes = data.startNodes;
  }

  ngOnInit(): void {}

  save() {
    let robots = [];

    let robotID = 1;

    const startNodes = this.startNodes.value;

    const distribution = this.visService.balance(
      this.nodes.length,
      startNodes.length
    );

    for (let i = 0; i < startNodes.length; i++) {
      for (let j = 0; j < distribution[i]; j++) {
        switch (this.algorithmType.value) {
          case AlgorithmType.RANDOM_DISPERSION:
            robots.push(
              new RandomDispersionRobot(
                robotID,
                RobotState.START,
                startNodes[i],
                null
              )
            );
            break;
          case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
            robots.push(
              new RandomWithLeaderDispersionRobot(
                robotID,
                RobotState.START,
                startNodes[i],
                null
              )
            );
            break;
          case AlgorithmType.ROTOR_ROUTER_DISPERSION:
            robots.push(
              new RotorRouterDispersionRobot(
                robotID,
                RobotState.START,
                startNodes[i],
                null
              )
            );
            break;
          case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
            robots.push(
              new RotorRouterWithLeaderDispersionRobot(
                robotID,
                RobotState.START,
                startNodes[i],
                null,
                null
              )
            );
            break;
          case AlgorithmType.FAULTLESS_DFS_DISPERSION:
            robots.push(
              new FaultlessDfsDispersionRobot(
                robotID,
                RobotState.START,
                startNodes[i],
                null,
                null,
                null
              )
            );
            break;
          case AlgorithmType.FAULTY_DFS_DISPERSION:
          robots.push(
            new FaultyDfsDispersionRobot(
              robotID,
              RobotState.START,
              startNodes[i],
              null,
              null,
              null,
              RobotPhase.FORWARD,
              distribution[i],
              null
            )
          );
          break;
          default:
            throw new Error('Algorithm type not found!');
        }
        robotID++;
      }
    }

    this.dialogRef.close({
      algorithmType: this.algorithmType.value,
      robots: robots,
    });
  }

  /** Form Controls */

  get algorithmType(): FormControl {
    return this.settingsFormGroup.controls['algorithmType'] as FormControl;
  }

  get startNodes(): FormControl {
    return this.settingsFormGroup.controls['startNodes'] as FormControl;
  }
}
