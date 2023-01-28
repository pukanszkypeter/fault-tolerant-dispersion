import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Language, languages } from "src/app/models/utils/Languages";
import { Page } from "src/app/models/utils/Pages";
import {
  SnackBarService,
  SnackBarType,
} from "src/app/services/utils/snack-bar.service";
import { DarkModeService } from "angular-dark-mode";
import { firstValueFrom, Observable } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Input() pages: readonly Page[] = [];
  languages: readonly Language[] = languages;
  darkMode$: Observable<boolean> = this.darkMode.darkMode$;

  constructor(
    private darkMode: DarkModeService,
    private translate: TranslateService,
    private snackBar: SnackBarService
  ) {}

  async toggleDarkMode(): Promise<void> {
    this.darkMode.toggle();
    const darkMode = await firstValueFrom(this.darkMode$);
    await this.snackBar.openSnackBar(
      darkMode ? "header.darkMode" : "header.lightMode",
      darkMode ? SnackBarType.LIGHT : SnackBarType.DARK
    );
  }

  async changeLanguage(languageKey: string): Promise<void> {
    this.translate.setDefaultLang(languageKey);
    await this.snackBar.openSnackBar(
      "header.languageChanged",
      SnackBarType.SUCCESS
    );
  }
}
