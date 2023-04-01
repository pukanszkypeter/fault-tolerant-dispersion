package hu.elte.ik.backend.service;

import hu.elte.ik.backend.model.fault.SimulationFault;
import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

@Service
@SessionScope
public interface AlgorithmService {
  Simulation<RandomNode, RandomEdge, RandomRobot> randomDispersion(
    Simulation<RandomNode, RandomEdge, RandomRobot> simulation
  );

  SimulationFault<RandomNode, RandomEdge, RandomRobot> randomFaultDispersion(
    SimulationFault<RandomNode, RandomEdge, RandomRobot> simulationFault
  );

  Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> rotorRouterDispersion(
    Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulation
  );

  SimulationFault<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> rotorRouterFaultDispersion(
    SimulationFault<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationFault
  );

  Simulation<DfsNode, DfsEdge, DfsRobot> dfsDispersion(
    Simulation<DfsNode, DfsEdge, DfsRobot> simulation
  );
}
