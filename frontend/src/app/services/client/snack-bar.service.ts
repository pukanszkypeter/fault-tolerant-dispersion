import { Component, Inject, Injectable } from "@angular/core";
import { MatSnackBar, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { defaultSnackBarConfig, SnackBarType } from "app/models/utils/SnackBar";

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
    if (translation !== key) {
      this._snackBar.openFromComponent(CustomSnackBarComponent, {
        ...defaultSnackBarConfig,
        data: { message: translation, type: type },
        panelClass: [type],
      });
    }
  }
}

@Component({
  selector: "custom-snack-bar",
  template: `
    <span class="message-container" matSnackBarLabel>
      <ng-container [ngSwitch]="data.type" ]>
        <mat-icon
          *ngSwitchCase="snackBarType.LIGHT"
          fontSet="material-icons-two-tone"
          >notifications</mat-icon
        >
        <mat-icon *ngSwitchCase="snackBarType.DARK">notifications</mat-icon>
        <mat-icon *ngSwitchCase="snackBarType.SUCCESS">check_circle</mat-icon>
        <mat-icon *ngSwitchCase="snackBarType.WARNING">warning</mat-icon>
        <mat-icon *ngSwitchCase="snackBarType.ERROR">error</mat-icon>
        <mat-icon *ngSwitchCase="snackBarType.INFO">info</mat-icon>
        <mat-icon *ngSwitchDefault>notifications</mat-icon>
      </ng-container>
      <span
        [ngClass]="{
          'message-dark': data.type === snackBarType.LIGHT,
          'message-light': data.type !== snackBarType.LIGHT
        }"
        >{{ data.message }}</span
      >
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
