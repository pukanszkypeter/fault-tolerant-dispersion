import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SimulationResult } from "app/models/test/SimulationResult";
import { API, ApiServiceRoutes } from "./Routes";

enum ResultRoutes {
  LATEST = "/latest",
}

@Injectable({
  providedIn: "root",
})
export class ResultService {
  constructor(private http: HttpClient) {}

  save(result: SimulationResult): Observable<SimulationResult> {
    return this.http.post<SimulationResult>(
      `${API}${ApiServiceRoutes.RESULT}`,
      result
    );
  }

  getLatests(id: number): Observable<SimulationResult[]> {
    return this.http.get<SimulationResult[]>(
      `${API}${ApiServiceRoutes.RESULT}${ResultRoutes.LATEST}/${id}`
    );
  }
}
