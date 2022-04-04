import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit {

  location: any;
  result: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LocationFormComponent>,
    ) {
    this.location = this.data;
   }

  ngOnInit(): void {
  }

  checked(checked: boolean, key: any, value: any): void {
    if (checked) {
      this.result[key] = value;
    } else {
      delete this.result[key];
    }
  }

  save(): void {
    this.dialogRef.close(this.result);
  }

}
