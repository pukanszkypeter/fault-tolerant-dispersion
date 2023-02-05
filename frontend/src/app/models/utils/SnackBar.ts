import { MatSnackBarConfig } from "@angular/material/snack-bar";

export enum SnackBarType {
  LIGHT = "light-snackbar",
  DARK = "dark-snackbar",
  SUCCESS = "success-snackbar",
  WARNING = "warning-snackbar",
  ERROR = "error-snackbar",
  INFO = "info-snackbar",
}

export const defaultSnackBarConfig: MatSnackBarConfig<any> = {
  duration: 2500,
  horizontalPosition: "end",
  verticalPosition: "bottom",
};
