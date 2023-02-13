import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BreakpointService } from "./services/client/breakpoint.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    translate: TranslateService,
    _breakpointService: BreakpointService
  ) {
    const i18n_key = localStorage.getItem("I18N_KEY");
    if (!i18n_key) {
      localStorage.setItem("I18N_KEY", "en");
      translate.setDefaultLang("en");
    } else {
      translate.setDefaultLang(i18n_key);
    }
  }
}
