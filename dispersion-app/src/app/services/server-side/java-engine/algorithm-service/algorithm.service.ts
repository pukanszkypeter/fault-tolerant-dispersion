import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SimulationStep } from 'src/app/models/dto/SimulationStep';
import { RandomDispersionNode } from 'src/app/models/algorithms/random-dispersion/RandomDispersionNode';
import { RandomDispersionEdge } from 'src/app/models/algorithms/random-dispersion/RandomDispersionEdge';
import { RandomDispersionRobot } from 'src/app/models/algorithms/random-dispersion/RandomDispersionRobot';
import { JavaEngineRoute } from '../../EngineRoutes';
import { AlgorithmServiceRoutes } from './AlgorithmServiceRoutes';
import { RandomWithLeaderDispersionNode } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionNode';
import { RandomWithLeaderDispersionEdge } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionEdge';
import { RandomWithLeaderDispersionRobot } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionRobot';
import { RotorRouterDispersionNode } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionNode';
import { RotorRouterDispersionEdge } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionEdge';
import { RotorRouterDispersionRobot } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionRobot';
import { RotorRouterWithLeaderDispersionNode } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionNode';
import { RotorRouterWithLeaderDispersionEdge } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionEdge';
import { RotorRouterWithLeaderDispersionRobot } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionRobot';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';
import { FaultlessDfsDispersionNode } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionNode';
import { FaultlessDfsDispersionEdge } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionEdge';
import { FaultlessDfsDispersionRobot } from 'src/app/models/algorithms/faultless-dfs-dispersion/FaultlessDfsDispersionRobot';
import { FaultyDfsDispersionNode } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionNode';
import { FaultyDfsDispersionEdge } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionEdge';
import { FaultyDfsDispersionRobot } from 'src/app/models/algorithms/faulty-dfs-dispersion/FaultyDfsDispersionRobot';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  constructor(private http: HttpClient) {}

  // Test

  test(algorithmType: AlgorithmType, simulation: any): Observable<number> {
    switch (algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        return this.testRandom(simulation);
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        return this.testRandomWithLeader(simulation);
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        return this.testRotorRouter(simulation);
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        return this.testRotorRouterWithLeader(simulation);
      default:
        throw new Error('Algorithm type not found!');
    }
  }

  // Random dispersion

  stepRandom(
    simulationStep: SimulationStep<
      RandomDispersionNode,
      RandomDispersionEdge,
      RandomDispersionRobot
    >
  ): Observable<
    SimulationStep<
      RandomDispersionNode,
      RandomDispersionEdge,
      RandomDispersionRobot
    >
  > {
    return this.http.post<
      SimulationStep<
        RandomDispersionNode,
        RandomDispersionEdge,
        RandomDispersionRobot
      >
    >(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.RANDOM +
        AlgorithmServiceRoutes.STEP,
      simulationStep
    );
  }

  testRandom(simulation: any): Observable<number> {
    return this.http.post<number>(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.RANDOM +
        AlgorithmServiceRoutes.TEST,
      simulation
    );
  }

  // Random with leader dispersion

  stepRandomWithLeader(
    simulationStep: SimulationStep<
      RandomWithLeaderDispersionNode,
      RandomWithLeaderDispersionEdge,
      RandomWithLeaderDispersionRobot
    >
  ): Observable<
    SimulationStep<
      RandomWithLeaderDispersionNode,
      RandomWithLeaderDispersionEdge,
      RandomWithLeaderDispersionRobot
    >
  > {
    return this.http.post<
      SimulationStep<
        RandomWithLeaderDispersionNode,
        RandomWithLeaderDispersionEdge,
        RandomWithLeaderDispersionRobot
      >
    >(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.RANDOM_WITH_LEADER +
        AlgorithmServiceRoutes.STEP,
      simulationStep
    );
  }

  testRandomWithLeader(simulation: any): Observable<number> {
    return this.http.post<number>(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.RANDOM_WITH_LEADER +
        AlgorithmServiceRoutes.TEST,
      simulation
    );
  }

  // Rotor router dispersion

  stepRotorRouter(
    simulationStep: SimulationStep<
      RotorRouterDispersionNode,
      RotorRouterDispersionEdge,
      RotorRouterDispersionRobot
    >
  ): Observable<
    SimulationStep<
      RotorRouterDispersionNode,
      RotorRouterDispersionEdge,
      RotorRouterDispersionRobot
    >
  > {
    return this.http.post<
      SimulationStep<
        RotorRouterDispersionNode,
        RotorRouterDispersionEdge,
        RotorRouterDispersionRobot
      >
    >(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.ROTOR_ROUTER +
        AlgorithmServiceRoutes.STEP,
      simulationStep
    );
  }

  testRotorRouter(simulation: any): Observable<number> {
    return this.http.post<number>(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.ROTOR_ROUTER +
        AlgorithmServiceRoutes.TEST,
      simulation
    );
  }

  // Rotor router with leader dispersion

  stepRotorRouterWithLeader(
    simulationStep: SimulationStep<
      RotorRouterWithLeaderDispersionNode,
      RotorRouterWithLeaderDispersionEdge,
      RotorRouterWithLeaderDispersionRobot
    >
  ): Observable<
    SimulationStep<
      RotorRouterWithLeaderDispersionNode,
      RotorRouterWithLeaderDispersionEdge,
      RotorRouterWithLeaderDispersionRobot
    >
  > {
    return this.http.post<
      SimulationStep<
        RotorRouterWithLeaderDispersionNode,
        RotorRouterWithLeaderDispersionEdge,
        RotorRouterWithLeaderDispersionRobot
      >
    >(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.ROTOR_ROUTER_WITH_LEADER +
        AlgorithmServiceRoutes.STEP,
      simulationStep
    );
  }

  testRotorRouterWithLeader(simulation: any): Observable<number> {
    return this.http.post<number>(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.ROTOR_ROUTER_WITH_LEADER +
        AlgorithmServiceRoutes.TEST,
      simulation
    );
  }

  // Faultless DFS dispersion

  stepFaultlessDfs(
    simulationStep: SimulationStep<
      FaultlessDfsDispersionNode,
      FaultlessDfsDispersionEdge,
      FaultlessDfsDispersionRobot
    >
  ): Observable<
    SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot>
  > {
    return this.http.post<
      SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot>
    >(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.FAULTLESS_DFS +
        AlgorithmServiceRoutes.STEP,
      simulationStep
    );
  }

  testFaultlessDfs(simulation: any): Observable<number> {
    return this.http.post<number>(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.FAULTLESS_DFS +
        AlgorithmServiceRoutes.TEST,
      simulation
    );
  }

  // Faulty DFS dispersion

  stepFaultyDfs(
    simulationStep: SimulationStep<
      FaultyDfsDispersionNode,
      FaultyDfsDispersionEdge,
      FaultyDfsDispersionRobot
    >
  ): Observable<
    SimulationStep<
      FaultyDfsDispersionNode,
      FaultyDfsDispersionEdge,
      FaultyDfsDispersionRobot
    >
  > {
    return this.http.post<
      SimulationStep<
        FaultyDfsDispersionNode,
        FaultyDfsDispersionEdge,
        FaultyDfsDispersionRobot
      >
    >(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.FAULTY_DFS +
        AlgorithmServiceRoutes.STEP,
      simulationStep
    );
  }

  testFaultyDfs(simulation: any): Observable<number> {
    return this.http.post<number>(
      JavaEngineRoute +
        AlgorithmServiceRoutes.ALGORITHM_SERVICE +
        AlgorithmServiceRoutes.FAULTY_DFS +
        AlgorithmServiceRoutes.TEST,
      simulation
    );
  }
  
}
