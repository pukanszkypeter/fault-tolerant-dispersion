import { Component, OnInit } from '@angular/core';
import {ActiveLinkService} from "../../../services/client-side/active-link/active-link.service";
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "./settings-dialog/settings-dialog.component";

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css']
})
export class StaticComponent implements OnInit {

  constructor(private activeLinkService: ActiveLinkService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.activeLinkService.setActiveLink(1);
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {height: "80%", width: "40%"});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    });
  }

}
