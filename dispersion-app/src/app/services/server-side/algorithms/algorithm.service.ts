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

  test(algorithmType: string, data: any): Observable<number> {
    switch (algorithmType) {
      case algorithmTypes[0].value:
        return this.testRandom(data);
      case algorithmTypes[1].value:
        return this.testRandomWithLeader(data);
      case algorithmTypes[2].value:
        return this.testRotorRouter(data);
      case algorithmTypes[3].value:
        return this.testRotorRouterWithLeader(data);
    }
  }

  stepRandom(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.RANDOM + AlgorithmRoutes.STEP, simulationState
    );
  }

  testRandom(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.RANDOM + AlgorithmRoutes.TEST, data
    );
  }

  stepRandomWithLeader(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.RANDOM_WITH_LEADER + AlgorithmRoutes.STEP, simulationState
    );
  }

  testRandomWithLeader(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.RANDOM_WITH_LEADER + AlgorithmRoutes.TEST, data
    );
  }

  stepRotorRouter(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER + AlgorithmRoutes.STEP, simulationState
    );
  }

  testRotorRouter(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER + AlgorithmRoutes.TEST, data
    );
  }

  stepRotorRouterWithLeader(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER_WITH_LEADER + AlgorithmRoutes.STEP, simulationState
    );
  }

  testRotorRouterWithLeader(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER_WITH_LEADER + AlgorithmRoutes.TEST, data
    );
  }

}
