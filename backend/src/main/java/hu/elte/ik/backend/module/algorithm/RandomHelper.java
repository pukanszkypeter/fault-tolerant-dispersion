package hu.elte.ik.backend.module.algorithm;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.utils.NodeState;
import hu.elte.ik.backend.model.utils.RobotState;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.utils.LocalLeaderElection;
import hu.elte.ik.backend.module.algorithm.utils.RandomNumber;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;

@Component
public class RandomHelper implements Stepper<RandomNode, RandomEdge, RandomRobot> {

    @Override
    public void step(Graph<RandomNode, RandomEdge> graph, List<RandomRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private static void look(Graph<RandomNode, RandomEdge> graph, List<RandomRobot> robotList) {
        for (RandomRobot robot : robotList) {
            if (robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE)) {
                RandomNode currentNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with Id " + robot.getOnId() + " not found!"));
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

    private static void compute(Graph<RandomNode, RandomEdge> graph,
            List<RandomRobot> robotList) {
        globalLeaderElection(robotList);

        for (RandomRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                robot.setDestinationId(robot.getOnId());
            } else if (robot.getState().equals(RobotState.EXPLORE)) {
                List<Long> nodeOptions = graph.getEdges().stream()
                        .filter(edge -> (Objects.equals(edge.getFromId(), robot.getOnId())) ||
                                (Objects.equals(edge.getToId(), robot.getOnId())))
                        .map(edge -> Objects.equals(edge.getToId(), robot.getOnId()) ? edge.getFromId()
                                : edge.getToId())
                        .collect(Collectors.toList());
                if (nodeOptions.size() > 0) {
                    int random = new RandomNumber().get(0, nodeOptions.size() - 1);
                    robot.setDestinationId(nodeOptions.get(random));
                } else {
                    throw new RuntimeException("Robot with Id " + robot.getId()
                            + " stepped into a trap on Node with Id " + robot.getOnId());
                }
            }
        }
    }

    private static void move(Graph<RandomNode, RandomEdge> graph, List<RandomRobot> robotList) {
        for (RandomRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                RandomNode currentNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with Id " + robot.getOnId() + " not found!"));
                currentNode.setState(NodeState.OCCUPIED);
                robot.setState(RobotState.TERMINATED);
            } else if (robot.getState().equals(RobotState.EXPLORE)) {
                robot.setOnId(robot.getDestinationId());
                RandomNode pendingNode = graph.getNodes().stream()
                        .filter(node -> node.getId().equals(robot.getOnId()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with Id " + robot.getOnId() + " not found!"));
                if (!pendingNode.getState().equals(NodeState.OCCUPIED)) {
                    pendingNode.setState(NodeState.PENDING);
                }
            }
        }
    }

    private static void globalLeaderElection(List<RandomRobot> robotList) {
        List<RandomRobot> leaders = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(Collectors.toList());

        for (RandomRobot robot : leaders) {
            List<RandomRobot> nominees = robotList.stream()
                    .filter(nominee -> nominee.getState().equals(RobotState.LEADER)
                            && Objects.equals(nominee.getOnId(), robot.getOnId()))
                    .collect(Collectors.toList());
            if (nominees.size() > 1) {
                RandomRobot leader = new LocalLeaderElection<RandomRobot>().run(nominees);
                nominees.remove(leader);
                for (RandomRobot nominee : nominees) {
                    nominee.setState(RobotState.EXPLORE);
                }
            }
        }
    }

}
