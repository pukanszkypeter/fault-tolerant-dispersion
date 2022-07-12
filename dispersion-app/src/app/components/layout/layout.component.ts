import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "./settings/settings.component";
import { filter } from 'rxjs/operators'
import { NavigationEnd, Router  } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(public dialog: MatDialog, 
              private router: Router) {

    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects 
      ) {
       this.handleActiveState(event.url.substring(1));
      }
    });
   }

  ngOnInit(): void {
  }

  public handleActiveState(path: string): void {
    const links = document.getElementsByTagName('a');

    switch(path) {

      case 'home':
        Array.from(links).forEach(link => link.classList.remove('active'));
        break;

      case 'simulator':
        Array.from(links).forEach(link => link.classList.remove('active'));
        links[1].classList.add('active');
        break;

      case 'automated-tester':
        Array.from(links).forEach(link => link.classList.remove('active'));
        links[2].classList.add('active');
        break;

      case 'visualization':
        Array.from(links).forEach(link => link.classList.remove('active'));
        links[3].classList.add('active');
        break;

      case 'open-street-map':
        Array.from(links).forEach(link => link.classList.remove('active'));
        links[4].classList.add('active');
        break;

      default:
        Array.from(links).forEach(link => link.classList.remove('active'));
        break;
    }
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
