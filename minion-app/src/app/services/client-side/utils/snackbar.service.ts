import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LanguageService} from "./language.service";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar,
              private languageService: LanguageService) { }

  openSnackBar(msg: string, style: string, action?: string, horizontalPosition?: any, verticalPosition?: any, duration?: number): void {
    this._snackBar.open(this.languageService.getTranslatedText(msg),
      action ? action : null,
      {
        horizontalPosition: horizontalPosition ? horizontalPosition : "center",
        verticalPosition: verticalPosition ? verticalPosition : "top",
        duration: duration ? duration : 2000,
        panelClass: [style]
      });
  }

}
