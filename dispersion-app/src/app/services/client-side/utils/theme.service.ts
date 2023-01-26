import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme = new BehaviorSubject(
    localStorage.getItem("theme") || "light"
  );

  theme$: Observable<string> = this.theme.asObservable();

  toggleTheme(theme: string) {
    this.theme.next(theme);
    localStorage.setItem("theme", theme);
  }

}
