package hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.*;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RandomDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.models.Graph;
import hu.elteik.knowledgelab.javaengine.core.utils.Color;
import hu.elteik.knowledgelab.javaengine.core.utils.NodeState;
import hu.elteik.knowledgelab.javaengine.core.utils.RobotState;

@Component
public class RandomDispersionManagement implements RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> {

    @Override
    public void step(Graph<RandomDispersionNode, RandomDispersionEdge> graph, List<RandomDispersionRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private void look(Graph<RandomDispersionNode, RandomDispersionEdge> graph, List<RandomDispersionRobot> robotList) {
        for (RandomDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE)) {
                RandomDispersionNode currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!currentNode.getState().equals(NodeState.OCCUPIED)) {
                    robot.setState(RobotState.LEADER);
                } else {
                    if (robot.getState().equals(RobotState.START)) {
                        robot.setState(RobotState.EXPLORE);
                    }
                    if (isComponentOccupied(graph, robot.getColor())) {
                        robot.setState(RobotState.TERMINATED);
                    }
                }
            }
        }
    }

    private void compute(Graph<RandomDispersionNode, RandomDispersionEdge> graph, List<RandomDispersionRobot> robotList) {

        globalLeaderElection(robotList);

        for (RandomDispersionRobot robot : robotList) {
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

    private void move(Graph<RandomDispersionNode, RandomDispersionEdge> graph, List<RandomDispersionRobot> robotList) {
        for (RandomDispersionRobot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) {
                RandomDispersionNode currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                currentNode.setState(NodeState.OCCUPIED);
                robot.setState(RobotState.SETTLED);
            }
            else if (robot.getState().equals(RobotState.EXPLORE)) {
                robot.setOnID(robot.getDestinationID());
                RandomDispersionNode pendingNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(robot.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + robot.getOnID() + " not found!"));
                if (!pendingNode.getState().equals(NodeState.OCCUPIED)) {
                    pendingNode.setState(NodeState.PENDING);
                }
            }
        }
    }

    private void globalLeaderElection(List<RandomDispersionRobot> robotList) {
        List<RandomDispersionRobot> leaders = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(Collectors.toList());

        for (RandomDispersionRobot robot : leaders) {
            List<RandomDispersionRobot> nominees = robotList.stream()
                    .filter(nominee -> nominee.getState().equals(RobotState.LEADER) && Objects.equals(nominee.getOnID(), robot.getOnID()))
                    .collect(Collectors.toList());
            if (nominees.size() > 1) {
                RandomDispersionRobot leader = new LocalLeaderElection<RandomDispersionRobot>().run(nominees);
                nominees.remove(leader);
                for (RandomDispersionRobot nominee : nominees) {
                    nominee.setState(RobotState.EXPLORE);
                }
            }
        }
    }

    private boolean isComponentOccupied(Graph<RandomDispersionNode, RandomDispersionEdge> graph, Color component) {
        List<RandomDispersionEdge> componentEdges = graph.getEdgeList().stream().filter(edge -> edge.getColor().equals(component)).collect(Collectors.toList());

        List<Long> fromIDs = componentEdges.stream().map(RandomDispersionEdge::getFromID).collect(Collectors.toList());
        List<Long> toIDs = componentEdges.stream().map(RandomDispersionEdge::getToID).collect(Collectors.toList());
        fromIDs.addAll(toIDs);

        List<Long> componentNodeIDs = fromIDs.stream().distinct().collect(Collectors.toList());
        List<RandomDispersionNode> componentNodes = new ArrayList<>();
        for (Long ID : componentNodeIDs) {
            componentNodes.add(graph.getNodeList().stream().filter(node -> node.getID().equals(ID)).findAny().orElseThrow(() -> new RuntimeException("Node with ID " + ID + " not found!")));
        }

        return componentNodes.size() == componentNodes.stream().filter(node -> node.getState().equals(NodeState.OCCUPIED)).count();
    }
    
}
