package hu.elte.ik.backend.module.algorithm;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.utils.NodeState;
import hu.elte.ik.backend.model.utils.RobotState;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.utils.LocalLeaderElection;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;

@Component
public class RotorRouterHelper implements Stepper<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> {

    @Override
    public void step(Graph<RotorRouterNode, RotorRouterEdge> graph,
            List<RotorRouterRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    public void look(Graph<RotorRouterNode, RotorRouterEdge> graph,
            List<RotorRouterRobot> robotList) {
        for (RotorRouterRobot robot : robotList) {
            if (robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE)) {
                RotorRouterNode currentNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnId() + " not found!"));
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

    public void compute(Graph<RotorRouterNode, RotorRouterEdge> graph,
            List<RotorRouterRobot> robotList) {
        globalLeaderElection(robotList);

        for (RotorRouterRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                robot.setDestinationId(robot.getOnId());
            } else if (robot.getState().equals(RobotState.EXPLORE)) {
                RotorRouterNode currentNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException(
                                "RotorRouterDispersionNode with ID " + robot.getOnId() + " not found!"));

                List<Long> nodeOptions = graph.getEdges().stream()
                        .filter(edge -> (Objects.equals(edge.getFromId(), currentNode.getId())) ||
                                (Objects.equals(edge.getToId(), currentNode.getId())))
                        .map(edge -> Objects.equals(edge.getToId(), currentNode.getId()) ? edge.getFromId()
                                : edge.getToId())
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

                robot.setDestinationId(currentNode.getRotorRouter());

            }
        }
    }

    public void move(Graph<RotorRouterNode, RotorRouterEdge> graph,
            List<RotorRouterRobot> robotList) {
        for (RotorRouterRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                RotorRouterNode currentNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnId() + " not found!"));
                currentNode.setState(NodeState.OCCUPIED);
                robot.setState(RobotState.TERMINATED);
            } else if (robot.getState().equals(RobotState.EXPLORE)) {
                robot.setOnId(robot.getDestinationId());
                RotorRouterNode pendingNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnId() + " not found!"));
                if (!pendingNode.getState().equals(NodeState.OCCUPIED)) {
                    pendingNode.setState(NodeState.PENDING);
                }
            }
        }
    }

    private void globalLeaderElection(List<RotorRouterRobot> robotList) {
        List<RotorRouterRobot> leaders = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(Collectors.toList());

        for (RotorRouterRobot robot : leaders) {
            List<RotorRouterRobot> nominees = robotList.stream()
                    .filter(nominee -> nominee.getState().equals(RobotState.LEADER)
                            && Objects.equals(nominee.getOnId(), robot.getOnId()))
                    .collect(Collectors.toList());
            if (nominees.size() > 1) {
                RotorRouterRobot leader = new LocalLeaderElection<RotorRouterRobot>().run(nominees);
                nominees.remove(leader);
                for (RotorRouterRobot nominee : nominees) {
                    nominee.setState(RobotState.EXPLORE);
                }
            }
        }
    }

}
