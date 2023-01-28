import { Component, Inject, Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MAT_SNACK_BAR_DATA,
} from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";

export enum SnackBarType {
  LIGHT = "light-snackbar",
  DARK = "dark-snackbar",
  SUCCESS = "success-snackbar",
  WARNING = "warning-snackbar",
  ERROR = "error-snackbar",
  INFO = "info-snackbar",
}

const defaultSnackBarConfig: MatSnackBarConfig<any> = {
  duration: 2500,
  horizontalPosition: "end",
  verticalPosition: "bottom",
};

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  constructor(
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  async openSnackBar(key: string, type: SnackBarType): Promise<void> {
    const translation = await firstValueFrom(this.translate.get(key));
    this._snackBar.openFromComponent(CustomSnackBarComponent, {
      ...defaultSnackBarConfig,
      data: { message: translation, type: type },
      panelClass: [type],
    });
  }
}

@Component({
  selector: "custom-snack-bar",
  template: `
    <span class="message-container" matSnackBarLabel>
      <mat-icon
        fontSet="material-icons-two-tone"
        *ngIf="data.type === snackBarType.LIGHT"
        >notifications</mat-icon
      >
      <mat-icon *ngIf="data.type === snackBarType.DARK">notifications</mat-icon>
      <mat-icon *ngIf="data.type === snackBarType.SUCCESS"
        >check_circle</mat-icon
      >
      <mat-icon *ngIf="data.type === snackBarType.WARNING">warning</mat-icon>
      <mat-icon *ngIf="data.type === snackBarType.ERROR">error</mat-icon>
      <mat-icon *ngIf="data.type === snackBarType.INFO">info</mat-icon>
      <span *ngIf="data.type === snackBarType.LIGHT" class="message-dark">{{
        data.message
      }}</span>
      <span *ngIf="data.type !== snackBarType.LIGHT" class="message-light">{{
        data.message
      }}</span>
    </span>
  `,
  styles: [
    `
      .message-container {
        display: flex;
        align-items: center;
      }
      .message-dark {
        margin-left: 0.5rem;
        color: black;
      }
      .message-light {
        margin-left: 0.5rem;
        color: white;
      }
    `,
  ],
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
  get snackBarType(): typeof SnackBarType {
    return SnackBarType;
  }
}
