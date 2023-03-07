package hu.elte.ik.backend.logic;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.algorithm.RobotState;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.simulation.Batch;
import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.model.simulation.SimulationBatch;
import hu.elte.ik.backend.model.simulation.SimulationResult;
import hu.elte.ik.backend.model.simulation.SimulationState;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import hu.elte.ik.backend.repository.BatchRepository;
import hu.elte.ik.backend.repository.ResultRepository;
import hu.elte.ik.backend.service.TestService;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Optional;
import lombok.AllArgsConstructor;

@SuppressWarnings({ "rawtypes", "unchecked" })
@AllArgsConstructor
public class TestServiceImpl implements TestService {

  private final BatchRepository batchRepository;
  private final ResultRepository resultRepository;
  private final AlgorithmServiceImpl algorithmServiceImpl;

  @Override
  public Batch saveBatch(Integer numOfTests) {
    Optional<SimulationResult> lastResult = resultRepository.findTopByOrderByIdDesc();
    if (lastResult.isPresent()) {
      return batchRepository.save(
        new Batch(
          null,
          lastResult.get().getId().intValue() + 1,
          lastResult.get().getId().intValue() + numOfTests
        )
      );
    } else {
      return batchRepository.save(new Batch(null, 1, numOfTests));
    }
  }

  @Override
  public Boolean testRandomDispersion(
    SimulationBatch<RandomNode, RandomEdge, RandomRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getRandomHelper(), simulationBatch);
  }

  @Override
  public Boolean testRandomLeaderDispersion(
    SimulationBatch<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getRandomLeaderHelper(), simulationBatch);
  }

  @Override
  public Boolean testRotorRouterDispersion(
    SimulationBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getRotorRouterHelper(), simulationBatch);
  }

  @Override
  public Boolean testRotorRouterLeaderDispersion(
    SimulationBatch<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> simulationBatch
  ) {
    return test(
      algorithmServiceImpl.getRotorRouterLeaderHelper(),
      simulationBatch
    );
  }

  @Override
  public Boolean testFaultlessDfsDispersion(
    SimulationBatch<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getFaultlessDfsHelper(), simulationBatch);
  }

  @Override
  public Boolean testFaultyDfsDispersion(
    SimulationBatch<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getFaultyDfsHelper(), simulationBatch);
  }

  public Boolean test(Stepper stepper, SimulationBatch simulationBatch) {
    for (int i = 0; i < simulationBatch.getNumOfTests(); i++) {
      Simulation testCase = createSimulation(simulationBatch);
      Boolean exception = false;

      while (!testCase.getState().equals(SimulationState.FINISHED)) {
        try {
          testCase = algorithmServiceImpl.step(stepper, testCase);
          continue;
        } catch (Exception e) {
          e.printStackTrace();
          exception = true;
          break;
        }
      }

      resultRepository.save(
        new SimulationResult(
          null,
          simulationBatch.getAlgorithmType(),
          simulationBatch.getGraphType(),
          simulationBatch.getGraph().getNodes().size(),
          exception
            ? null
            : (int) testCase
              .getRobots()
              .stream()
              .filter(robot ->
                !((Robot) robot).getState().equals(RobotState.CRASHED)
              )
              .count(),
          testCase.getStep().intValue(),
          exception
            ? null
            : (int) testCase
              .getRobots()
              .stream()
              .filter(robot ->
                ((Robot) robot).getState().equals(RobotState.CRASHED)
              )
              .count()
        )
      );
    }

    return true;
  }

  public Simulation createSimulation(SimulationBatch simulationBatch) {
    return new Simulation(
      0L,
      SimulationState.DEFAULT,
      new Graph<>(
        simulationBatch
          .getGraph()
          .getNodes()
          .stream()
          .map(node -> {
            try {
              Class<?> nodeType = node.getClass();
              Constructor<?> nodeConstructor = nodeType.getConstructor(
                nodeType
              );
              return nodeConstructor.newInstance(node);
            } catch (Exception e) {
              e.printStackTrace();
            }
            return null;
          })
          .toList(),
        simulationBatch
          .getGraph()
          .getEdges()
          .stream()
          .map(edge -> {
            try {
              Class<?> edgeType = edge.getClass();
              Constructor<?> edgeConstructor = edgeType.getConstructor(
                edgeType
              );
              return edgeConstructor.newInstance(edge);
            } catch (Exception e) {
              e.printStackTrace();
            }
            return null;
          })
          .toList()
      ),
      new ArrayList<>(
        simulationBatch
          .getRobots()
          .stream()
          .map(robot -> {
            try {
              Class<?> robotType = robot.getClass();
              Constructor<?> robotConstructor = robotType.getConstructor(
                robotType
              );
              return robotConstructor.newInstance(robot);
            } catch (Exception e) {
              e.printStackTrace();
            }
            return null;
          })
          .toList()
      )
    );
  }
}
