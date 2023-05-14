import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Language, languages } from "app/models/utils/Languages";
import { Page } from "app/models/utils/Pages";
import { SnackBarService } from "app/services/client/snack-bar.service";
import { DarkModeService } from "angular-dark-mode";
import { firstValueFrom, map, Observable } from "rxjs";
import { SnackBarType } from "app/models/utils/SnackBar";
import { BreakpointService } from "app/services/client/breakpoint.service";
import { VisService } from "app/services/client/vis.service";
import { LoadingService } from "app/services/client/loading.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Input() pages: readonly Page[] = [];
  languages: readonly Language[] = languages;
  darkMode$: Observable<boolean> = this.darkMode.darkMode$;
  breakpoint$: Observable<string> = this.breakpoint.breakpoint$;
  loading$: Observable<boolean> = this.loading.loading$;

  constructor(
    private darkMode: DarkModeService,
    private translate: TranslateService,
    private snackBar: SnackBarService,
    private breakpoint: BreakpointService,
    private vis: VisService,
    private loading: LoadingService
  ) {}

  async toggleDarkMode(): Promise<void> {
    this.darkMode.toggle();
    await firstValueFrom(this.vis.updateGraph());
    const darkMode = await firstValueFrom(this.darkMode$);
    await this.snackBar.openSnackBar(
      darkMode ? "header.darkModeNotification" : "header.lightModeNotification",
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

  get isSmallScreen$(): Observable<boolean> {
    return this.breakpoint$.pipe(
      map((breakpoint) => {
        return breakpoint === "XS" || breakpoint === "S" || breakpoint === "M";
      })
    );
  }
}
