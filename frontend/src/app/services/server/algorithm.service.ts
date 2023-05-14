import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlgorithmType } from "app/models/algorithm/AlgorithmType";
import { SimulationFault } from "app/models/fault/SimulationFault";
import { Simulation } from "app/models/simulation/Simulation";
import { API, ApiServiceRoutes } from "./Routes";

enum AlgorithmRoutes {
  FAULT = "/fault",
}

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

  stepFault(
    type: AlgorithmType,
    simulationFault: SimulationFault
  ): Observable<SimulationFault> {
    const TypeRoute: string = type.toLocaleLowerCase().replace(/_/g, "-");

    return this.http.post<SimulationFault>(
      `${API}${ApiServiceRoutes.ALGORITHM}/${TypeRoute}${AlgorithmRoutes.FAULT}`,
      simulationFault
    );
  }
}
