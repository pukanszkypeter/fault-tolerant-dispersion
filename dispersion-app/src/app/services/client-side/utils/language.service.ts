import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

export const LANGUAGE_KEY = 'LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) { }

  getLanguage(): string {
    return this.translate.getDefaultLang();
  }

  setLanguage(value: string): void {
    localStorage.setItem(LANGUAGE_KEY, value);
    this.translate.setDefaultLang(value);
  }

  setDefaultLanguage(): void {
    let language = localStorage.getItem(LANGUAGE_KEY);
    if (!language) {
      this.setLanguage('EN');
    } else {
      this.translate.setDefaultLang(language);
    }
  }

  getTranslatedText(key: string): string {
    let text: string;
    this.translate.get(key).subscribe(res => {
      text = res;
    }, err => {
      console.log(err);
    });

    return text;
  }

}
