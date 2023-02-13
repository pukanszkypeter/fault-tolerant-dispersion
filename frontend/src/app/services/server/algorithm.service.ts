import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlgorithmType } from "src/app/models/algorithm/AlgorithmType";
import { Simulation } from "src/app/models/simulation/Simulation";
import { API, ApiServiceRoutes } from "./Routes";

@Injectable({
  providedIn: "root",
})
export class AlgorithmService {
  constructor(private http: HttpClient) {}

  step(type: AlgorithmType, simulation: Simulation): Observable<Simulation> {
    const TypeRoute: string = type.toLocaleLowerCase().replace(/_/g, "-");

    return this.http.post<Simulation>(
      `${API}${ApiServiceRoutes.ALGORITHM}/${TypeRoute}`,
      simulation
    );
  }
}
