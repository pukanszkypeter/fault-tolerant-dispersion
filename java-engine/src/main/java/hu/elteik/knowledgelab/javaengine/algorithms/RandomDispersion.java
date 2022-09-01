package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.algorithms.utils.GlobalLeaderElection;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.OccupiedComponentChecker;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.RandomNumber;
import hu.elteik.knowledgelab.javaengine.core.models.base.*;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class RandomDispersion {

    public void step(Graph graph, List<Robot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private void look(Graph graph, List<Robot> robotList) {
        for (Robot robot : robotList) {
            if (robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE)) {
                Node currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!currentNode.getState().equals(NodeState.OCCUPIED)) {
                    robot.setState(RobotState.LEADER);
                } else {
                    if (robot.getState().equals(RobotState.START)) {
                        robot.setState(RobotState.EXPLORE);
                    }
                    if (new OccupiedComponentChecker().run(graph, robot.getColor())) {
                        robot.setState(RobotState.TERMINATED);
                    }
                }
            }
        }
    }

    private void compute(Graph graph, List<Robot> robotList) {

        new GlobalLeaderElection().run(robotList);

        for (Robot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                robot.setDestinationID(robot.getOnID());
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                List<Long> nodeOptions = graph.getEdgeList().stream()
                        .filter(edge ->
                                (Objects.equals(edge.getFromID(), robot.getOnID()) && Objects.equals(edge.getColor(), robot.getColor())) ||
                                (Objects.equals(edge.getToID(), robot.getOnID()) && Objects.equals(edge.getColor(), robot.getColor())))
                        .map(edge -> Objects.equals(edge.getToID(), robot.getOnID()) ? edge.getFromID() : edge.getToID())
                        .collect(Collectors.toList());
                if (nodeOptions.size() > 0) {
                    int random = new RandomNumber().get(0, nodeOptions.size() - 1);
                    robot.setDestinationID(nodeOptions.get(random));
                } else {
                    throw new RuntimeException("Robot with ID " + robot.getID() + " stepped into a trap on Node with ID " + robot.getOnID());
                }
            }
        }
    }

    private void move(Graph graph, List<Robot> robotList) {
        for (Robot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                Node currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                currentNode.setState(NodeState.OCCUPIED);
                robot.setState(RobotState.SETTLED);
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                robot.setOnID(robot.getDestinationID());
                Node pendingNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!pendingNode.getState().equals(NodeState.OCCUPIED)) {
                    pendingNode.setState(NodeState.PENDING);
                }
            }
        }
    }

}
