import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BreakpointService } from "./services/client/breakpoint.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    translate: TranslateService,
    router: Router,
    breakpointService: BreakpointService
  ) {
    const i18n_key = localStorage.getItem("I18N_KEY");
    if (!i18n_key) {
      localStorage.setItem("I18N_KEY", "en");
      translate.setDefaultLang("en");
    } else {
      translate.setDefaultLang(i18n_key);
    }
    router.events.subscribe(async (event) => {
      const breakpoint = await firstValueFrom(breakpointService.breakpoint$);
      const navigated = event instanceof NavigationEnd;
      if (breakpoint === "XS" && navigated) {
        router.navigateByUrl("page-not-supported");
      }
    });
  }
}
