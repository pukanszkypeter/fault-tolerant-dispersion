package hu.elte.ik.backend.module.algorithm;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.utils.NodeState;
import hu.elte.ik.backend.model.utils.RobotState;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class FaultyDfsHelper
  implements Stepper<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> {

  @Override
  public void step(
    Graph<FaultyDfsNode, FaultyDfsEdge> graph,
    List<FaultyDfsRobot> robotList
  ) {
    // active-, inactive- robots
    List<FaultyDfsRobot> activeRobots = robotList
      .stream()
      .filter(robot ->
        !robot.getState().equals(RobotState.TERMINATED) &&
        !robot.getState().equals(RobotState.CRASHED)
      )
      .collect(Collectors.toList());
    activeRobots.forEach(robot -> robot.setState(RobotState.EXPLORE));
    List<FaultyDfsRobot> inactiveRobots = robotList
      .stream()
      .filter(robot ->
        robot.getState().equals(RobotState.TERMINATED) &&
        !robot.getState().equals(RobotState.CRASHED)
      )
      .collect(Collectors.toList());

    // current node, edges
    FaultyDfsNode currentNode = graph
      .getNodes()
      .stream()
      .filter(node -> node.getId().equals(activeRobots.get(0).getOnId()))
      .findAny()
      .orElse(null);
    List<FaultyDfsEdge> currentEdges = graph
      .getEdges()
      .stream()
      .filter(edge ->
        currentNode.getId().equals(edge.getFromId()) ||
        currentNode.getId().equals(edge.getToId())
      )
      .collect(Collectors.toList());

    // extra infos
    boolean isCurrentNodeOccupied = inactiveRobots
      .stream()
      .map(robot -> robot.getOnId())
      .collect(Collectors.toList())
      .contains(currentNode.getId());
    FaultyDfsRobot lastRobot = activeRobots.get(activeRobots.size() - 1);

    // COMMUNICATE
    FaultyDfsRobot router;

    if (!isCurrentNodeOccupied) {
      router = lastRobot;
      router.setState(RobotState.TERMINATED);
      router.setParent(router.getLastUsedPort());
      currentNode.setState(NodeState.OCCUPIED);

      // -> Backtrack recalibration condition
      if (router.getPhase().equals(RobotPhase.BACKTRACK)) {
        activeRobots
          .stream()
          .forEach(robot -> robot.setTreeLabel(router.getId()));
      }

      activeRobots.stream().forEach(robot -> robot.setEmptyBefore(true));
    } else {
      FaultyDfsRobot occupier = inactiveRobots
        .stream()
        .filter(robot -> robot.getOnId().equals(currentNode.getId()))
        .findAny()
        .orElse(null);
      router = occupier;

      // -> Forward recalibration condition
      if (
        lastRobot.getPhase().equals(RobotPhase.FORWARD) &&
        (
          router.getParent() == lastRobot.getLastUsedPort() ||
          router.getChild() == lastRobot.getLastUsedPort()
        ) &&
        lastRobot.getTreeLabel() == router.getTreeLabel() &&
        lastRobot.isEmptyBefore()
      ) {
        activeRobots
          .stream()
          .forEach(robot -> robot.setTreeLabel(router.getId()));
        router.setTreeLabel(router.getId());
        router.setParent(lastRobot.getLastUsedPort());
        router.setChild(0);
      }

      // -> Overwrite router
      if (lastRobot.getTreeLabel() < router.getTreeLabel()) {
        router.setTreeLabel(lastRobot.getTreeLabel());
        router.setParent(lastRobot.getLastUsedPort());
        router.setChild(0);
      }

      activeRobots.stream().forEach(robot -> robot.setEmptyBefore(false));
    }

    // COMPUTE
    int nodeDegree = (int) currentEdges.stream().count();
    int oldChild = router.getChild();

    if (oldChild <= nodeDegree) {
      if (oldChild + 1 != router.getParent()) {
        router.setChild(oldChild + 1);
      } else {
        router.setChild(oldChild + 2);
      }
    }

    FaultyDfsEdge travelEdge = currentEdges
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
    List<FaultyDfsRobot> travelers = robotList
      .stream()
      .filter(robot ->
        !robot.getState().equals(RobotState.TERMINATED) &&
        !robot.getState().equals(RobotState.CRASHED)
      )
      .collect(Collectors.toList());
    int exitPort = travelEdge.getFromId().equals(currentNode.getId())
      ? travelEdge.getFromPort()
      : travelEdge.getToPort();

    FaultyDfsNode travelDestination = graph
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
        .contains(travelDestination.getId()) &&
      travelers.size() > 0
    ) {
      travelDestination.setState(NodeState.PENDING);
    }

    for (int i = 0; i < travelers.size(); i++) {
      travelers
        .get(i)
        .setOnId(
          travelEdge.getFromPort() == exitPort
            ? travelEdge.getToId()
            : travelEdge.getFromId()
        );
      travelers
        .get(i)
        .setLastUsedPort(
          travelEdge.getFromPort() == exitPort
            ? travelEdge.getToPort()
            : travelEdge.getFromPort()
        );
      travelers
        .get(i)
        .setPhase(
          router.getParent() == exitPort
            ? RobotPhase.BACKTRACK
            : (
                lastRobot.getLastUsedPort() != router.getParent() &&
                lastRobot.getLastUsedPort() != oldChild
              )
              ? RobotPhase.BACKTRACK
              : RobotPhase.FORWARD
        );
    }
  }
}
