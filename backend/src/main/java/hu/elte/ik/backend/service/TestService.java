package hu.elte.ik.backend.service;

import hu.elte.ik.backend.model.simulation.Batch;
import hu.elte.ik.backend.model.simulation.SimulationBatch;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

@Service
@SessionScope
public interface TestService {
  Batch saveBatch(Integer numOfTests);

  Boolean testRandomDispersion(
    SimulationBatch<RandomNode, RandomEdge, RandomRobot> simulationBatch
  );

  Boolean testRandomLeaderDispersion(
    SimulationBatch<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> simulationBatch
  );

  Boolean testRotorRouterDispersion(
    SimulationBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationBatch
  );

  Boolean testRotorRouterLeaderDispersion(
    SimulationBatch<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> simulationBatch
  );

  Boolean testFaultlessDfsDispersion(
    SimulationBatch<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> simulationBatch
  );

  Boolean testFaultyDfsDispersion(
    SimulationBatch<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> simulationBatch
  );
}
