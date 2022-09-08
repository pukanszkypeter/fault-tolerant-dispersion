import { Injectable } from '@angular/core';
import {SimulationState} from "../../../models/entities/SimulationState";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ServerRoute} from "../ServerRoute";
import {AlgorithmRoutes} from "./AlgorithmRoutes";
import {algorithmTypes} from "../../../models/types/AlgorithmType";
import { NodeState } from 'src/app/models/entities/Node';

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
      case algorithmTypes[4].value:
        return this.stepGlobalComOnDFS(simulationState);
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
      case algorithmTypes[4].value:
        return this.testGlobalComOnDFS(data);
    }
  }

  stepRandom(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.RANDOM, this.converter(simulationState)
    );
  }

  testRandom(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.RANDOM + AlgorithmRoutes.TEST, data
    );
  }

  stepRandomWithLeader(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.RANDOM_WITH_LEADER, this.converter(simulationState)
    );
  }

  testRandomWithLeader(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.RANDOM_WITH_LEADER + AlgorithmRoutes.TEST, data
    );
  }

  stepRotorRouter(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER, this.converter(simulationState)
    );
  }

  testRotorRouter(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER + AlgorithmRoutes.TEST, data
    );
  }

  stepRotorRouterWithLeader(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER_WITH_LEADER, this.converter(simulationState)
    );
  }

  testRotorRouterWithLeader(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.ROTOR_ROUTER_WITH_LEADER + AlgorithmRoutes.TEST, data
    );
  }

  stepGlobalComOnDFS(simulationState: SimulationState): Observable<SimulationState> {
    return this.http.post<SimulationState>(
      ServerRoute + AlgorithmRoutes.GLOBAL_COM_ON_DFS, this.converter(simulationState)
    );
  }

  testGlobalComOnDFS(data: any): Observable<number> {
    return this.http.post<number>(
      ServerRoute + AlgorithmRoutes.GLOBAL_COM_ON_DFS + AlgorithmRoutes.TEST, data
    );
  }

  converter(simulationState: SimulationState): any {
    let DTO: any = {
      nodes: simulationState.nodes.map(node => new Object({id: node.id, state: this.nodeStateConverter(node.state)})),
      edges: simulationState.edges.map(edge => new Object({id: edge.id, fromID: edge.fromID, toID: edge.toID, color: this.colorConverter(edge.color)})),
      robots: simulationState.robots.map(robot => new Object({id: robot.id, onID: robot.onID, state: robot.state, color: this.colorConverter(robot.color), lastEdgeID: robot.lastEdgeID})),
      counter: simulationState.counter
    };
    return DTO;
  }

  nodeStateConverter(nodeState: NodeState): string {
    switch (nodeState) {
      case NodeState.DEFAULT:
        return 'DEFAULT';
      case NodeState.PENDING:
        return 'PENDING';
      case NodeState.OCCUPIED:
        return 'OCCUPIED';
    }
  }

  colorConverter(color: string): string {
    switch (color) {
      case '#000000':
        return 'BLACK';
      case '#003300':
        return 'GREEN';
      case '#666666':
        return 'GREY';
      case '#663300':
        return 'BROWN';
      case '#ff9900':
        return 'ORANGE';
      case '#ffff00':
        return 'YELLOW';
      case '#ff33cc':
        return 'PINK';
      case '#9900cc':
        return 'PURPLE';
      case '#0000ff':
        return 'BLUE';
      case '#00ffff':
        return 'AQUA';
    }
  }

}
