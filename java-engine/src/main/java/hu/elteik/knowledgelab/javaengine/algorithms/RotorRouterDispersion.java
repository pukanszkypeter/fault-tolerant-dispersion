package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.algorithms.utils.GlobalLeaderElection;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.OccupiedComponentChecker;
import hu.elteik.knowledgelab.javaengine.core.models.base.NodeState;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionGraph;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionNode;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionRobot;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class RotorRouterDispersion {

    public void step(RotorRouterDispersionGraph graph, List<RotorRouterDispersionRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    public void look(RotorRouterDispersionGraph graph, List<RotorRouterDispersionRobot> robotList) {
        for (RotorRouterDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE)) {
                RotorRouterDispersionNode currentNode = graph.getRotorRouterDispersionNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!currentNode.getState().equals(NodeState.OCCUPIED)) {
                    robot.setState(RobotState.LEADER);
                } else {
                    if (robot.getState().equals(RobotState.START)) {
                        robot.setState(RobotState.EXPLORE);
                    }
                    if (new OccupiedComponentChecker<RotorRouterDispersionGraph>().run(graph, robot.getColor())) {
                        robot.setState(RobotState.TERMINATED);
                    }
                }
            }
        }
    }

    public void compute(RotorRouterDispersionGraph graph, List<RotorRouterDispersionRobot> robotList) {

        new GlobalLeaderElection<RotorRouterDispersionRobot>().run(robotList);

        for (RotorRouterDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                robot.setDestinationID(robot.getOnID());
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                RotorRouterDispersionNode currentNode = graph.getRotorRouterDispersionNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("RotorRouterDispersionNode with ID " + robot.getOnID() + " not found!"));

                List<Long> nodeOptions = graph.getEdgeList().stream()
                        .filter(edge ->
                                (Objects.equals(edge.getFromID(), currentNode.getID()) && Objects.equals(edge.getColor(), robot.getColor())) ||
                                (Objects.equals(edge.getToID(), currentNode.getID()) && Objects.equals(edge.getColor(), robot.getColor())))
                        .map(edge -> Objects.equals(edge.getToID(), currentNode.getID()) ? edge.getFromID() : edge.getToID())
                        .collect(Collectors.toList());

                if (currentNode.getCurrentComponentPointer() == null) {
                    currentNode.setCurrentComponentPointer(new HashMap<>());
                    currentNode.getCurrentComponentPointer().put(robot.getColor(), nodeOptions.get(0));
                } else if (!currentNode.getCurrentComponentPointer().containsKey(robot.getColor())) {
                    currentNode.getCurrentComponentPointer().put(robot.getColor(), nodeOptions.get(0));
                } else {
                    int index = nodeOptions.indexOf(currentNode.getCurrentComponentPointer().get(robot.getColor()));
                    if (index == (nodeOptions.size() - 1)) {
                        currentNode.getCurrentComponentPointer().put(robot.getColor(), nodeOptions.get(0));
                    } else {
                        index++;
                        currentNode.getCurrentComponentPointer().put(robot.getColor(), nodeOptions.get(index));
                    }
                }

                robot.setDestinationID(currentNode.getCurrentComponentPointer().get(robot.getColor()));

            }
        }
    }

    public void move(RotorRouterDispersionGraph graph, List<RotorRouterDispersionRobot> robotList) {
        for (RotorRouterDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                RotorRouterDispersionNode currentNode = graph.getRotorRouterDispersionNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                currentNode.setState(NodeState.OCCUPIED);
                robot.setState(RobotState.SETTLED);
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                robot.setOnID(robot.getDestinationID());
                RotorRouterDispersionNode pendingNode = graph.getRotorRouterDispersionNodeList().stream()
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
