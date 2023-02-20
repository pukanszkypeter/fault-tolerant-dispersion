import { Component, Input } from "@angular/core";
import { map, Observable } from "rxjs";
import { Page } from "src/app/models/utils/Pages";
import { BreakpointService } from "src/app/services/client/breakpoint.service";
import packageJson from "../../../../../package.json";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  version: string = packageJson.version;
  @Input() pages: readonly Page[] = [];
  breakpoint$: Observable<string> = this.breakpoint.breakpoint$;

  constructor(private breakpoint: BreakpointService) {}

  get isSmallScreen$(): Observable<boolean> {
    return this.breakpoint$.pipe(
      map((breakpoint) => {
        return breakpoint === "XS" || breakpoint === "S";
      })
    );
  }
}
