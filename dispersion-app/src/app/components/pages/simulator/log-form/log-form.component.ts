import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggerService } from '../../../../services/server-side/python-engine/logger-service/logger.service';
import { SnackbarService } from '../../../../services/client-side/utils/snackbar.service';

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
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {}

  save(): void {
    this.logger.log(this.data).subscribe(
      (res) => {
        if (res) {
          this.snackBarService.openSnackBar(
            'SUCCESSFUL_SAVE',
            'success-snackbar'
          );
          this.dialogRef.close({ reset: true });
        } else {
          this.snackBarService.openSnackBar(
            'UNSUCCESSFUL_SAVE',
            'error-snackbar'
          );
          this.dialogRef.close({ reset: true });
        }
      },
      (err) => {
        console.log(err);
        this.snackBarService.openSnackBar(
          'UNSUCCESSFUL_SAVE',
          'error-snackbar'
        );
        this.dialogRef.close({ reset: true });
      }
    );
  }
}
