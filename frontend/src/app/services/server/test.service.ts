import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Batch } from "src/app/models/test/Batch";
import { SimulationBatch } from "src/app/models/test/SimulationBatch";
import { SimulationFaultBatch } from "src/app/models/test/SimulationFaultBatch";
import { API, ApiServiceRoutes } from "./Routes";

enum TestRoutes {
  BATCH = "/batch",
  FAULT = "/fault",
}

@Injectable({
  providedIn: "root",
})
export class TestService {
  constructor(private http: HttpClient) {}

  getBatch(numOfTests: number): Observable<Batch> {
    return this.http.get<Batch>(
      `${API}${ApiServiceRoutes.TEST}${TestRoutes.BATCH}/${numOfTests}`
    );
  }

  test(simulationBatch: SimulationBatch): Observable<boolean> {
    const TypeRoute: string = simulationBatch.algorithmType
      .toLocaleLowerCase()
      .replace(/_/g, "-");

    return this.http.post<boolean>(
      `${API}${ApiServiceRoutes.TEST}/${TypeRoute}`,
      simulationBatch
    );
  }

  testFault(simulationFaultBatch: SimulationFaultBatch): Observable<boolean> {
    const TypeRoute: string = simulationFaultBatch.algorithmType
      .toLocaleLowerCase()
      .replace(/_/g, "-");

    return this.http.post<boolean>(
      `${API}${ApiServiceRoutes.TEST}/${TypeRoute}${TestRoutes.FAULT}`,
      simulationFaultBatch
    );
  }
}
