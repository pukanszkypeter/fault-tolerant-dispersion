import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { getLanguageCode, Language } from 'src/app/models/utils/Language';
import { LanguageService } from 'src/app/services/client-side/utils/language.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  languages = Object.keys(Language);

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe((event) => {
        event.url === '/'
          ? this.handleActiveState('dashboard')
          : this.handleActiveState(event.url.substring(1));
      });
  }

  ngOnInit(): void {}

  public handleActiveState(path: string): void {
    const links = document.getElementsByTagName('a');

    switch (path) {
      case 'dashboard':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[2].classList.add('active');
        break;
      case 'simulator':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[3].classList.add('active');
        break;
      case 'tester':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[4].classList.add('active');
        break;
      case 'results':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[5].classList.add('active');
        break;
      case 'open-street-map':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[6].classList.add('active');
        break;
      case 'profile':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[7].classList.add('active');
        break;
      case 'settings':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[9].classList.add('active');
        break;
      case 'changelog':
        Array.from(links).forEach((link) => link.classList.remove('active'));
        links[10].classList.add('active');
        break;
      default:
        Array.from(links).forEach((link) => link.classList.remove('active'));
        break;
    }
  }

  public changeLanguage(language: string): void {
    this.languageService.setLanguage(getLanguageCode(language));
  }
}
