import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  public toggle(): void {
    this.loading.next(!this.loading.getValue());
  }
}
