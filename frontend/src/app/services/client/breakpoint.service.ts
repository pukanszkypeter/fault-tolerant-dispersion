import { BreakpointObserver } from "@angular/cdk/layout";
import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, takeUntil } from "rxjs";
import {
  Breakpoints,
  BreakpointSettings,
  getBreakpointKey,
} from "src/app/models/utils/Breakpoints";
import { SnackBarType } from "src/app/models/utils/SnackBar";
import { SnackBarService } from "./snack-bar.service";

@Injectable({
  providedIn: "root",
})
export class BreakpointService implements OnDestroy {
  destroyed = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private snackBar: SnackBarService,
    private router: Router
  ) {
    this.breakpointObserver
      .observe(Object.values(Breakpoints))
      .pipe(takeUntil(this.destroyed))
      .subscribe(async (result) => {
        const key = getBreakpointKey(
          Object.keys(result.breakpoints as BreakpointSettings)
            .reverse()
            .filter((key) => result.breakpoints[key])[0] as Breakpoints
        );
        if (key === "XS") {
          this.router.navigateByUrl("/page-not-supported");
          await this.snackBar.openSnackBar(
            "app.responsiveWarning",
            SnackBarType.WARNING
          );
        }
        localStorage.setItem("breakpoint", key);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  get breakpoint$(): Observable<string> {
    return new Observable((subscriber) => {
      subscriber.next(localStorage.getItem("breakpoint")!);
    });
  }
}
