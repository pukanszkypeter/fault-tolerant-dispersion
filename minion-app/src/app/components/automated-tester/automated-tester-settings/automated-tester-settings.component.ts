import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {graphTypes, hasNodeValueConstraint} from "../../../models/types/GraphType";
import {algorithmTypes} from "../../../models/types/AlgorithmType";
import { Output, EventEmitter } from '@angular/core';
import {GraphConfiguration} from "../../simulator/graph-configuration/GraphConfiguration";

@Component({
  selector: 'app-automated-test-settings',
  templateUrl: './automated-tester-settings.component.html',
  styleUrls: ['./automated-tester-settings.component.css']
})
export class AutomatedTesterSettingsComponent implements OnInit {

  @Output() settingsEvent = new EventEmitter<{simulationConfiguration: GraphConfiguration, tests: number}>();

  graphTypes = graphTypes;
  algorithmTypes = algorithmTypes;

  numberOfNodes = [1];

  settingsFormGroup: FormGroup;

  constructor(fb: FormBuilder) {
    this.settingsFormGroup = fb.group({
      algorithmType: new FormControl('', Validators.required),
      graphType: new FormControl('', Validators.required),
      nodes: new FormControl(1, [Validators.min(1), Validators.max(50), Validators.required]),
      robots: new FormControl(1, [Validators.min(1), Validators.max(50), Validators.required]),
      colors: new FormControl(1, [Validators.min(1), Validators.max(10), Validators.required]),
      startNodes: new FormControl([1], Validators.required),
      tests: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(1000)])
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

  run(): void {
    this.settingsEvent.emit({
      simulationConfiguration: new GraphConfiguration(
        this.algorithmType.value,
        this.graphType.value,
        this.nodes.value,
        //this.robots.value,
        //this.colors.value,
        //this.startNodes.value
      ),
      tests: this.tests.value
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

  get tests(): FormControl {
    return this.settingsFormGroup.controls['tests'] as FormControl;
  }

}
