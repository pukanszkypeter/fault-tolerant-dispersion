import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "./settings/settings.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openSettingsDialog(): void {
    this.dialog.open(SettingsComponent, {
      height: '40%',
      width: '30%',
      position: {top: '2%'},
      disableClose: true
    });
  }

}
