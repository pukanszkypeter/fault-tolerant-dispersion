package hu.elte.ik.backend.logic;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.algorithm.RobotState;
import hu.elte.ik.backend.model.fault.SimulationFault;
import hu.elte.ik.backend.model.graph.Node;
import hu.elte.ik.backend.model.graph.NodeState;
import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.model.simulation.SimulationState;
import hu.elte.ik.backend.module.algorithm.DfsHelper;
import hu.elte.ik.backend.module.algorithm.RandomHelper;
import hu.elte.ik.backend.module.algorithm.RotorRouterHelper;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import hu.elte.ik.backend.service.AlgorithmService;
import java.util.List;
import java.util.Optional;
import java.util.SplittableRandom;
import lombok.AllArgsConstructor;
import lombok.Getter;

@SuppressWarnings({ "rawtypes", "unchecked" })
@Getter
@AllArgsConstructor
public class AlgorithmServiceImpl implements AlgorithmService {

  private final RandomHelper randomHelper;
  private final RotorRouterHelper rotorRouterHelper;
  private final DfsHelper dfsHelper;

  @Override
  public Simulation<RandomNode, RandomEdge, RandomRobot> randomDispersion(
    Simulation<RandomNode, RandomEdge, RandomRobot> simulation
  ) {
    return step(randomHelper, simulation);
  }

  @Override
  public SimulationFault<RandomNode, RandomEdge, RandomRobot> randomFaultDispersion(
    SimulationFault<RandomNode, RandomEdge, RandomRobot> simulationFault
  ) {
    return stepFault(randomHelper, simulationFault);
  }

  @Override
  public Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> rotorRouterDispersion(
    Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulation
  ) {
    return step(rotorRouterHelper, simulation);
  }

  @Override
  public SimulationFault<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> rotorRouterFaultDispersion(
    SimulationFault<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationFault
  ) {
    return stepFault(rotorRouterHelper, simulationFault);
  }

  @Override
  public Simulation<DfsNode, DfsEdge, DfsRobot> dfsDispersion(
    Simulation<DfsNode, DfsEdge, DfsRobot> simulation
  ) {
    return step(dfsHelper, simulation);
  }

  public Simulation step(Stepper stepper, Simulation simulation) {
    if (simulation.getState().equals(SimulationState.DEFAULT)) {
      simulation.setState(SimulationState.IN_PROGRESS);
    }

    stepper.step(simulation.getGraph(), simulation.getRobots());
    simulation.setStep(simulation.getStep() + 1);

    if (isFinished(simulation)) {
      simulation.setState(SimulationState.FINISHED);
    }

    return simulation;
  }

  public SimulationFault stepFault(
    Stepper stepper,
    SimulationFault simulationFault
  ) {
    if (simulationFault.getState().equals(SimulationState.DEFAULT)) {
      simulationFault.setState(SimulationState.IN_PROGRESS);
    }

    crashRobots(simulationFault);

    stepper.step(simulationFault.getGraph(), simulationFault.getRobots());
    simulationFault.setStep(simulationFault.getStep() + 1);

    if (isFinished(simulationFault)) {
      simulationFault.setState(SimulationState.FINISHED);
    }

    return simulationFault;
  }

  public void crashRobots(SimulationFault simulationFault) {
    long faults = simulationFault
      .getRobots()
      .stream()
      .filter(robot -> ((Robot) robot).getState().equals(RobotState.CRASHED))
      .count();
    if (faults < simulationFault.getFaults()) {
      List<Robot> notCrashedRobots = simulationFault
        .getRobots()
        .stream()
        .filter(robot -> !((Robot) robot).getState().equals(RobotState.CRASHED))
        .toList();

      for (Robot crashCandidate : notCrashedRobots) {
        boolean crashed = draw(simulationFault.getProbability());
        if (crashed && faults < simulationFault.getFaults()) {
          if (crashCandidate.getState().equals(RobotState.TERMINATED)) {
            Node occupiedNode =
              (
                (Optional<Node>) simulationFault
                  .getGraph()
                  .getNodes()
                  .stream()
                  .filter(node ->
                    ((Node) node).getId() == crashCandidate.getOnId()
                  )
                  .findAny()
              ).orElseThrow(() ->
                  new RuntimeException(
                    "Node with Id " + crashCandidate.getOnId() + " not found!"
                  )
                );
            occupiedNode.setState(NodeState.DEFAULT);
          }
          crashCandidate.setState(RobotState.CRASHED);
          faults++;
        }
      }
    }
  }

  public boolean draw(Double probability) {
    SplittableRandom random = new SplittableRandom();
    Double chance = (random.nextInt(1, 100001) / 1000.000);
    return chance <= probability;
  }

  public boolean isFinished(Simulation simulation) {
    boolean graphFinished =
      simulation
        .getGraph()
        .getNodes()
        .stream()
        .filter(node -> ((Node) node).getState().equals(NodeState.OCCUPIED))
        .count() ==
      simulation.getGraph().getNodes().size();
    boolean robotsFinished =
      simulation
        .getRobots()
        .stream()
        .filter(robot ->
          List
            .of(RobotState.TERMINATED, RobotState.CRASHED)
            .contains(((Robot) robot).getState())
        )
        .count() ==
      simulation.getRobots().size();
    return graphFinished || robotsFinished;
  }
}
