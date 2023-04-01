import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { Page } from "src/app/models/utils/Pages";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
  @Input() pages: readonly Page[] = [];
  constructor(private router: Router) {}

  get $activePage(): Observable<Page> {
    const index = this.pages.findIndex(
      (page) => page.key === this.router.url.slice(1)
    );
    return new Observable((subscriber) =>
      subscriber.next(
        index > -1 ? this.pages[index] : this.pages[this.pages.length - 1]
      )
    );
  }

  get $color(): Observable<string> {
    return this.$activePage.pipe(
      map((page) =>
        !["page-not-found", "page-not-supported"].includes(page.key)
          ? "primary"
          : "warn"
      )
    );
  }
}
