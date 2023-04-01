package hu.elte.ik.backend.module.algorithm;

import hu.elte.ik.backend.model.algorithm.RobotState;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.graph.NodeState;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class DfsHelper implements Stepper<DfsNode, DfsEdge, DfsRobot> {

  @Override
  public void step(Graph<DfsNode, DfsEdge> graph, List<DfsRobot> robotList) {
    /*
     * initalize(graph, robotList);
     * look(graph, robotList);
     * compute(graph, robotList);
     * move(graph, robotList);
     */

    this.initalizePorts(graph);

    // Active-, Inactive- Robots
    List<DfsRobot> activeRobots = robotList
      .stream()
      .filter(robot -> !robot.getState().equals(RobotState.TERMINATED))
      .collect(Collectors.toList());
    activeRobots.forEach(robot -> robot.setState(RobotState.EXPLORE));
    List<DfsRobot> inactiveRobots = robotList
      .stream()
      .filter(robot -> robot.getState().equals(RobotState.TERMINATED))
      .collect(Collectors.toList());

    // Current node and edges
    DfsNode currentNode = graph
      .getNodes()
      .stream()
      .filter(node -> node.getId().equals(activeRobots.get(0).getOnId()))
      .findAny()
      .orElse(null);
    List<DfsEdge> currentEdges = graph
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
    DfsRobot router;

    if (!isCurrentNodeOccupied) {
      router = activeRobots.get(activeRobots.size() - 1);
      router.setState(RobotState.TERMINATED);
      router.setParent(router.getLastUsedPort());
      currentNode.setState(NodeState.OCCUPIED);
    } else {
      DfsRobot occupier = inactiveRobots
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

    DfsEdge travelEdge = currentEdges
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
    List<DfsRobot> travelers = robotList
      .stream()
      .filter(robot -> !robot.getState().equals(RobotState.TERMINATED))
      .collect(Collectors.toList());

    DfsNode travelDestination = graph
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

  private void initalizePorts(Graph<DfsNode, DfsEdge> graph) {
    for (DfsNode node : graph.getNodes()) {
      int index = 1;
      for (DfsEdge edge : graph.getEdges()) {
        if (edge.getFromId() == node.getId()) {
          edge.setFromPort(index);
          index++;
        } else if (edge.getToId() == node.getId()) {
          edge.setToPort(index);
          index++;
        }
      }
    }
  }
}
