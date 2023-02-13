import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  public distributeAll(all: number, piece: number): number[] {
    let mod = all % piece;
    const balance = (all - mod) / piece;

    let list = [];
    for (let i = 0; i < piece; i++) {
      mod === 0 ? list.push(balance) : list.push(balance + 1);
      if (mod > 0) {
        mod--;
      }
    }

    return list;
  }
}
