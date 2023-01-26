import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { getLanguageCode, Language } from 'src/app/models/utils/Language';
import { LanguageService } from 'src/app/services/client-side/utils/language.service';
import { ToastService } from 'src/app/services/client-side/utils/toast.service';
import { v4 as uuidv4 } from "uuid";
import { ThemeService } from 'src/app/services/client-side/utils/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  languages = Object.keys(Language);

  constructor(
    public dialog: MatDialog,
    public toastService: ToastService,
    public themeService: ThemeService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe((event) => {
        event.url === '/'
          ? this.handleActiveState('home')
          : this.handleActiveState(event.url.substring(1));
      });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe({
      next(value) {
        document.documentElement.setAttribute('data-bs-theme', value); 
        document.getElementById("language-dropdown").setAttribute('data-bs-theme', value);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  public handleActiveState(path: string): void {
    const links = document.getElementsByClassName('custom-link');

    switch (path) {
      case 'home':
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        links[0].classList.add('active-link');
        break;
      case 'simulator':
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        links[1].classList.add('active-link');
        break;
      case 'tester':
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        links[2].classList.add('active-link');
        break;
      case 'results':
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        links[3].classList.add('active-link');
        break;
      case 'open-street-map':
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        links[4].classList.add('active-link');
        break;
      case 'changelog':
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        links[5].classList.add('active-link');
        break;
      default:
        Array.from(links).forEach((link) => link.classList.remove('active-link'));
        break;
    }
  }

  changeLanguage(language: string): void {
    this.languageService.setLanguage(getLanguageCode(language));
    this.toastService.show({uuid: uuidv4(), headerKey: "application.feedback.notification", bodyKey: "application.feedback.languageChanged"});
  }

  toggleTheme(nextTheme: string): void {
      this.themeService.toggleTheme(nextTheme);
      document.documentElement.setAttribute('data-bs-theme', nextTheme);
      document.getElementById("language-dropdown").setAttribute('data-bs-theme', nextTheme); 
  }

}
