import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Batch } from "src/app/models/simulation/Batch";
import { SimulationBatch } from "src/app/models/simulation/SimulationBatch";
import { API, ApiServiceRoutes } from "./Routes";

enum TestRoutes {
  BATCH = "/batch",
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
}
