import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {languages} from "../../../models/others/Languages";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";
import {LanguageService} from "../../../services/client-side/language.service";
import {SnackbarService} from "../../../services/client-side/snackbar.service";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  languageControl: FormControl;

  languages = languages;

  constructor(private languageService: LanguageService,
              private snackBarService: SnackbarService,
              private dialogRef: MatDialogRef<SettingsComponent>) {

    this.languageControl = new FormControl(this.languageService.getLanguage(), []);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.languageService.setLanguage(this.languageControl.value);
    setTimeout(() => this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar'), 500);
    this.dialogRef.close();
  }

}
