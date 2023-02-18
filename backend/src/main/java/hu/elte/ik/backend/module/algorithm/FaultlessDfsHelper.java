package hu.elte.ik.backend.module.algorithm;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.utils.NodeState;
import hu.elte.ik.backend.model.utils.RobotState;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class FaultlessDfsHelper
  implements Stepper<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> {

  @Override
  public void step(
    Graph<FaultlessDfsNode, FaultlessDfsEdge> graph,
    List<FaultlessDfsRobot> robotList
  ) {
    // Active-, Inactive- Robots
    List<FaultlessDfsRobot> activeRobots = robotList
      .stream()
      .filter(robot -> !robot.getState().equals(RobotState.TERMINATED))
      .collect(Collectors.toList());
    activeRobots.forEach(robot -> robot.setState(RobotState.EXPLORE));
    List<FaultlessDfsRobot> inactiveRobots = robotList
      .stream()
      .filter(robot -> robot.getState().equals(RobotState.TERMINATED))
      .collect(Collectors.toList());

    // Current node and edges
    FaultlessDfsNode currentNode = graph
      .getNodes()
      .stream()
      .filter(node -> node.getId().equals(activeRobots.get(0).getOnId()))
      .findAny()
      .orElse(null);
    List<FaultlessDfsEdge> currentEdges = graph
      .getEdges()
      .stream()
      .filter(edge ->
        currentNode.getId().equals(edge.getFromId()) ||
        currentNode.getId().equals(edge.getToId())
      )
      .collect(Collectors.toList());

    // Helper attributes
    boolean isCurrentNodeOccupied = inactiveRobots
      .stream()
      .map(robot -> robot.getOnId())
      .collect(Collectors.toList())
      .contains(currentNode.getId());
    int nodeDegree = (int) currentEdges.stream().count();

    // COMMUNICATE
    FaultlessDfsRobot router;

    if (!isCurrentNodeOccupied) {
      router = activeRobots.get(activeRobots.size() - 1);
      router.setState(RobotState.TERMINATED);
      router.setParent(router.getLastUsedPort());
      currentNode.setState(NodeState.OCCUPIED);
    } else {
      FaultlessDfsRobot occupier = inactiveRobots
        .stream()
        .filter(robot -> robot.getOnId() == currentNode.getId())
        .findAny()
        .orElse(null);
      router = occupier;
    }

    // COMPUTE
    int oldChildValue = router.getChild();

    if (oldChildValue <= nodeDegree) {
      if (oldChildValue + 1 != router.getParent()) {
        router.setChild(oldChildValue + 1);
      } else {
        router.setChild(oldChildValue + 2);
      }
    }

    FaultlessDfsEdge travelEdge = currentEdges
      .stream()
      .filter(edge ->
        edge.getFromId().equals(currentNode.getId())
          ? edge.getFromPort() == router.getChild()
          : edge.getToPort() == router.getChild()
      )
      .findAny() // -> FORWARD PHASE
      .orElseGet(() -> { // -> BACKTRACK PHASE
        return currentEdges
          .stream()
          .filter(edge ->
            edge.getFromId().equals(currentNode.getId())
              ? edge.getFromPort() == router.getParent()
              : edge.getToPort() == router.getParent()
          )
          .findAny()
          .orElse(null);
      });

    // MOVE
    List<FaultlessDfsRobot> travelers = robotList
      .stream()
      .filter(robot -> !robot.getState().equals(RobotState.TERMINATED))
      .collect(Collectors.toList());

    FaultlessDfsNode travelDestination = graph
      .getNodes()
      .stream()
      .filter(node ->
        node
          .getId()
          .equals(
            travelEdge.getFromId().equals(currentNode.getId())
              ? travelEdge.getToId()
              : travelEdge.getFromId()
          )
      )
      .findAny()
      .orElse(null);

    if (
      !inactiveRobots
        .stream()
        .map(robot -> robot.getOnId())
        .collect(Collectors.toList())
        .contains(travelDestination.getId())
    ) {
      travelDestination.setState(NodeState.PENDING);
    }

    for (int i = 0; i < travelers.size(); i++) {
      travelers.get(i).setOnId(travelDestination.getId());
      travelers
        .get(i)
        .setLastUsedPort(
          travelEdge.getFromId().equals(currentNode.getId())
            ? travelEdge.getToPort()
            : travelEdge.getFromPort()
        );
    }
  }
}
