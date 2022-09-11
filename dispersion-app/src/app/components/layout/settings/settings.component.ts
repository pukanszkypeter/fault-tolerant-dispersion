import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { getLanguageCode, Language } from 'src/app/models/utils/Language';
import { LanguageService } from "../../../services/client-side/utils/language.service";
import { SnackbarService } from "../../../services/client-side/utils/snackbar.service";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  languageControl: FormControl;

  languages = Object.keys(Language);

  constructor(private languageService: LanguageService,
              private snackBarService: SnackbarService,
              private dialogRef: MatDialogRef<SettingsComponent>) {

    this.languageControl = new FormControl('', []);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.languageService.setLanguage(getLanguageCode(this.languageControl.value));
    setTimeout(() => this.snackBarService.openSnackBar('SUCCESSFUL_SAVE', 'success-snackbar'), 500);
    this.dialogRef.close();
  }

}
