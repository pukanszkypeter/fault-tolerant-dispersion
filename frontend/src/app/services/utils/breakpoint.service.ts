import { BreakpointObserver } from "@angular/cdk/layout";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import {
  Breakpoints,
  BreakpointSettings,
  getBreakpointKey,
} from "src/app/models/utils/Breakpoints";

@Injectable({
  providedIn: "root",
})
export class BreakpointService implements OnDestroy {
  destroyed = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(Object.values(Breakpoints))
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        localStorage.setItem(
          "breakpoint",
          getBreakpointKey(
            Object.keys(result.breakpoints as BreakpointSettings)
              .reverse()
              .filter((key) => result.breakpoints[key])[0] as Breakpoints
          )
        );
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
