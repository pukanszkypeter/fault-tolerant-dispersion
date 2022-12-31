import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { getLanguageCode, Language } from 'src/app/models/utils/Language';
import { LanguageService } from 'src/app/services/client-side/utils/language.service';
import { ToastService } from 'src/app/services/client-side/utils/toast.service';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  languages = Object.keys(Language);
  colorMode: string = localStorage.getItem("colorMode") || "light";
  

  constructor(
    public dialog: MatDialog,
    public toastService: ToastService,
    private router: Router,
    private languageService: LanguageService,
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
    document.documentElement.setAttribute('data-bs-theme', this.colorMode);
    document.getElementById("language-dropdown").setAttribute('data-bs-theme', this.colorMode);
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

  toggleColorMode(): void {
    const nextColorMode: string = this.colorMode === "light" ? "dark" : "light";
    this.colorMode = nextColorMode;
    document.documentElement.setAttribute('data-bs-theme', this.colorMode);
    document.getElementById("language-dropdown").setAttribute('data-bs-theme', this.colorMode);
    localStorage.setItem("colorMode", this.colorMode);
  }

}
