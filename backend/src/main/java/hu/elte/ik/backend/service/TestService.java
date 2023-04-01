package hu.elte.ik.backend.service;

import hu.elte.ik.backend.model.test.Batch;
import hu.elte.ik.backend.model.test.SimulationBatch;
import hu.elte.ik.backend.model.test.SimulationFaultBatch;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

@Service
@SessionScope
public interface TestService {
  Batch saveBatch(Integer numOfTests);

  Boolean testRandomDispersion(
    SimulationBatch<RandomNode, RandomEdge, RandomRobot> simulationBatch
  );

  Boolean testRandomFaultDispersion(
    SimulationFaultBatch<RandomNode, RandomEdge, RandomRobot> simulationFaultBatch
  );

  Boolean testRotorRouterDispersion(
    SimulationBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationBatch
  );

  Boolean testRotorRouterFaultDispersion(
    SimulationFaultBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationFaultBatch
  );

  Boolean testDfsDispersion(
    SimulationBatch<DfsNode, DfsEdge, DfsRobot> simulationBatch
  );
}
