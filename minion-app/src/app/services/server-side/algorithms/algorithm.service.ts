import { Injectable } from '@angular/core';
import {SimulationState} from "../../../models/entities/SimulationState";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ServerRoute} from "../ServerRoute";
import {AlgorithmRoutes} from "./AlgorithmRoutes";
import {algorithmTypes} from "../../../models/types/AlgorithmType";

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {



  constructor(private http: HttpClient) { }

  step(algorithmType: string, simulationState: SimulationState): Observable<SimulationState> {
    switch (algorithmType) {
      case algorithmTypes[0].value:
        return this.stepRandom(simulationState);
      case algorithmTypes[1].value:
        return this.stepRandomWithLeader(simulationState);
      case algorithmTypes[2].value:
        return this.stepRotorRouter(simulationState);
      case algorithmTypes[3].value:
        return this.stepRotorRouterWithLeader(simulationState);
    }
  }

  stepRandom(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.RANDOM + AlgorithmRoutes.STEP, simulationState
    );
  }

  stepRandomWithLeader(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.RANDOM_WITH_LEADER + AlgorithmRoutes.STEP, simulationState
    );
  }

  stepRotorRouter(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER + AlgorithmRoutes.STEP, simulationState
    );
  }

  stepRotorRouterWithLeader(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER_WITH_LEADER + AlgorithmRoutes.STEP, simulationState
    );
  }

}
