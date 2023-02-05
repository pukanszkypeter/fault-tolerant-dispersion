import { BreakpointObserver } from "@angular/cdk/layout";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import {
  Breakpoints,
  BreakpointSettings,
  getBreakpointKey,
} from "src/app/models/utils/Breakpoints";

// Breakpoints are based on Bootstrap containers
// https://getbootstrap.com/docs/5.3/layout/containers/
// XS: < 576px
// S: ≥ 576px
// M: ≥ 768px
// L: ≥ 992px
// XL: ≥ 1200px
// XXL: ≥ 1400px

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
        this.updateBreakpoint(result.breakpoints as BreakpointSettings);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  updateBreakpoint(breakpoints: BreakpointSettings): void {
    if (breakpoints["(min-width: 0px)"]) {
      localStorage.setItem("breakpoint", getBreakpointKey(Breakpoints.XS));
    }
    if (breakpoints["(min-width: 576px)"]) {
      localStorage.setItem("breakpoint", getBreakpointKey(Breakpoints.S));
    }
    if (breakpoints["(min-width: 768px)"]) {
      localStorage.setItem("breakpoint", getBreakpointKey(Breakpoints.M));
    }
    if (breakpoints["(min-width: 992px)"]) {
      localStorage.setItem("breakpoint", getBreakpointKey(Breakpoints.L));
    }
    if (breakpoints["(min-width: 1200px)"]) {
      localStorage.setItem("breakpoint", getBreakpointKey(Breakpoints.XL));
    }
    if (breakpoints["(min-width: 1400px)"]) {
      localStorage.setItem("breakpoint", getBreakpointKey(Breakpoints.XXL));
    }
  }
}
