import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggerService } from '../../../../services/server-side/python-engine/logger-service/logger.service';


@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css'],
})
export class LogFormComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LogFormComponent>,
    private logger: LoggerService,

  ) {}

  ngOnInit(): void {}

  save(): void {
    this.logger.log(this.data).subscribe(
      (res) => {
        if (res) {

          this.dialogRef.close({ reset: true });
        } else {

          this.dialogRef.close({ reset: true });
        }
      },
      (err) => {
        console.log(err);

        this.dialogRef.close({ reset: true });
      }
    );
  }
}
