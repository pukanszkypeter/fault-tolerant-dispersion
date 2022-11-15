package hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.LocalLeaderElection;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RotorRouterDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.models.Graph;
import hu.elteik.knowledgelab.javaengine.core.utils.NodeState;
import hu.elteik.knowledgelab.javaengine.core.utils.RobotState;

@Component
public class RotorRouterDispersionManagement implements RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> {

    @Override
    public void step(Graph<RotorRouterDispersionNode, RotorRouterDispersionEdge> graph, List<RotorRouterDispersionRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    public void look(Graph<RotorRouterDispersionNode, RotorRouterDispersionEdge> graph, List<RotorRouterDispersionRobot> robotList) {
        for (RotorRouterDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE)) {
                RotorRouterDispersionNode currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!currentNode.getState().equals(NodeState.OCCUPIED)) {
                    robot.setState(RobotState.LEADER);
                } else {
                    if (robot.getState().equals(RobotState.START)) {
                        robot.setState(RobotState.EXPLORE);
                    }
                }
            }
        }
    }

    public void compute(Graph<RotorRouterDispersionNode, RotorRouterDispersionEdge> graph, List<RotorRouterDispersionRobot> robotList) {
        globalLeaderElection(robotList);

        for (RotorRouterDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                robot.setDestinationID(robot.getOnID());
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                RotorRouterDispersionNode currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("RotorRouterDispersionNode with ID " + robot.getOnID() + " not found!"));

                List<Long> nodeOptions = graph.getEdgeList().stream()
                        .filter(edge ->
                                (Objects.equals(edge.getFromID(), currentNode.getID())) ||
                                (Objects.equals(edge.getToID(), currentNode.getID())))
                        .map(edge -> Objects.equals(edge.getToID(), currentNode.getID()) ? edge.getFromID() : edge.getToID())
                        .collect(Collectors.toList());

                if (currentNode.getRotorRouter() == null) {
                    currentNode.setRotorRouter(nodeOptions.get(0));
                } else {
                    int index = nodeOptions.indexOf(currentNode.getRotorRouter());
                    if (index == (nodeOptions.size() - 1)) {
                        currentNode.setRotorRouter(nodeOptions.get(0));
                    } else {
                        index++;
                        currentNode.setRotorRouter(nodeOptions.get(index));
                    }
                }

                robot.setDestinationID(currentNode.getRotorRouter());

            }
        }
    }

    public void move(Graph<RotorRouterDispersionNode, RotorRouterDispersionEdge> graph, List<RotorRouterDispersionRobot> robotList) {
        for (RotorRouterDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                RotorRouterDispersionNode currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                currentNode.setState(NodeState.OCCUPIED);
                robot.setState(RobotState.SETTLED);
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                robot.setOnID(robot.getDestinationID());
                RotorRouterDispersionNode pendingNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!pendingNode.getState().equals(NodeState.OCCUPIED)) {
                    pendingNode.setState(NodeState.PENDING);
                }
            }
        }
    }

    private void globalLeaderElection(List<RotorRouterDispersionRobot> robotList) {
        List<RotorRouterDispersionRobot> leaders = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(Collectors.toList());

        for (RotorRouterDispersionRobot robot : leaders) {
            List<RotorRouterDispersionRobot> nominees = robotList.stream()
                    .filter(nominee -> nominee.getState().equals(RobotState.LEADER)
                            && Objects.equals(nominee.getOnID(), robot.getOnID()))
                    .collect(Collectors.toList());
            if (nominees.size() > 1) {
                RotorRouterDispersionRobot leader = new LocalLeaderElection<RotorRouterDispersionRobot>().run(nominees);
                nominees.remove(leader);
                for (RotorRouterDispersionRobot nominee : nominees) {
                    nominee.setState(RobotState.EXPLORE);
                }
            }
        }
    }
    
}
