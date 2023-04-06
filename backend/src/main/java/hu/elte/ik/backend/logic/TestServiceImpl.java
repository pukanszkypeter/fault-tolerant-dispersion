package hu.elte.ik.backend.logic;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.algorithm.RobotState;
import hu.elte.ik.backend.model.fault.SimulationFault;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.result.SimulationResult;
import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.model.simulation.SimulationState;
import hu.elte.ik.backend.model.test.Batch;
import hu.elte.ik.backend.model.test.SimulationBatch;
import hu.elte.ik.backend.model.test.SimulationFaultBatch;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
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
    Optional<SimulationResult> lastResult =
      resultRepository.findTopByOrderByIdDesc();
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
  public Boolean testRandomFaultDispersion(
    SimulationFaultBatch<RandomNode, RandomEdge, RandomRobot> simulationFaultBatch
  ) {
    return testFault(
      algorithmServiceImpl.getRandomHelper(),
      simulationFaultBatch
    );
  }

  @Override
  public Boolean testRotorRouterDispersion(
    SimulationBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getRotorRouterHelper(), simulationBatch);
  }

  @Override
  public Boolean testRotorRouterFaultDispersion(
    SimulationFaultBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationFaultBatch
  ) {
    return testFault(
      algorithmServiceImpl.getRotorRouterHelper(),
      simulationFaultBatch
    );
  }

  @Override
  public Boolean testDfsDispersion(
    SimulationBatch<DfsNode, DfsEdge, DfsRobot> simulationBatch
  ) {
    return test(algorithmServiceImpl.getDfsHelper(), simulationBatch);
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
          exception ? null : testCase.getStep().intValue(),
          exception ? null : simulationBatch.getGraph().getNodes().size(),
          exception ? null : simulationBatch.getTeams(),
          exception ? null : simulationBatch.getRobots().size(),
          null,
          null,
          null
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

  public Boolean testFault(
    Stepper stepper,
    SimulationFaultBatch simulationFaultBatch
  ) {
    for (int i = 0; i < simulationFaultBatch.getNumOfTests(); i++) {
      SimulationFault testCase = createSimulationFault(simulationFaultBatch);
      Boolean exception = false;

      while (!testCase.getState().equals(SimulationState.FINISHED)) {
        try {
          testCase = algorithmServiceImpl.stepFault(stepper, testCase);
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
          simulationFaultBatch.getAlgorithmType(),
          simulationFaultBatch.getGraphType(),
          exception ? null : testCase.getStep().intValue(),
          exception ? null : simulationFaultBatch.getGraph().getNodes().size(),
          exception ? null : simulationFaultBatch.getTeams(),
          exception ? null : simulationFaultBatch.getRobots().size(),
          exception
            ? null
            : (int) testCase
              .getRobots()
              .stream()
              .filter(robot ->
                ((Robot) robot).getState().equals(RobotState.CRASHED)
              )
              .count(),
          exception ? null : simulationFaultBatch.getFaults(),
          exception ? null : simulationFaultBatch.getProbability()
        )
      );
    }

    return true;
  }

  public SimulationFault createSimulationFault(
    SimulationFaultBatch simulationFaultBatch
  ) {
    return new SimulationFault(
      0L,
      SimulationState.DEFAULT,
      new Graph<>(
        simulationFaultBatch
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
        simulationFaultBatch
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
        simulationFaultBatch
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
      ),
      simulationFaultBatch.getFaults(),
      simulationFaultBatch.getProbability()
    );
  }
}
