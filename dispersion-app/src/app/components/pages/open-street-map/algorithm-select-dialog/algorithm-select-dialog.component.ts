import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';

@Component({
  selector: 'app-algorithm-select-dialog',
  templateUrl: './algorithm-select-dialog.component.html',
  styleUrls: ['./algorithm-select-dialog.component.css'],
})
export class AlgorithmSelectDialogComponent implements OnInit {
  algorithmTypes = Object.keys(AlgorithmType);

  algorithmTypeGroup: FormGroup;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<AlgorithmSelectDialogComponent>
  ) {
    this.algorithmTypeGroup = fb.group({
      algorithmType: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  save() {
    this.dialogRef.close({
      algorithmType: this.algorithmType.value,
    });
  }

  get algorithmType(): FormControl {
    return this.algorithmTypeGroup.controls['algorithmType'] as FormControl;
  }
}
