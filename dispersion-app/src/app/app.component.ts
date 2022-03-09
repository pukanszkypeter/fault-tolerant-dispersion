import { Component } from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {icons} from "./models/others/Icons";
import {LanguageService} from "./services/client-side/utils/language.service";

export const LANGUAGE_KEY = 'LANGUAGE';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private language: LanguageService) {
    this.language.setDefaultLanguage();
    for (let icon of icons) {
      iconRegistry.addSvgIcon(icon.selector, sanitizer.bypassSecurityTrustResourceUrl(icon.path))
    }
  }

}
