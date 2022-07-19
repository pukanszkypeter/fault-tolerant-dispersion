package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import hu.elteik.knowledgelab.javaengine.core.models.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

public class ComponentProblemBreakPoint {

    public void check(Graph graph, List<Robot> robotList) throws RuntimeException {
        List<Robot> availableRobots = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.START) || robot.getState().equals(RobotState.EXPLORE))
                .collect(Collectors.toList());

        Map<Color, List<Robot>> availableRobotComponents = availableRobots.stream().collect(groupingBy(Robot::getColor));
        Map<Color, List<Edge>> edgeComponents = graph.getEdgeList().stream().collect(groupingBy(Edge::getColor));
        for (Map.Entry<Color, List<Robot>> robotComponent : availableRobotComponents.entrySet()) {
            List<Long> toIDs = edgeComponents.get(robotComponent.getKey()).stream().map(Edge::getToID).collect(Collectors.toList());
            List<Long> fromIDs = edgeComponents.get(robotComponent.getKey()).stream().map(Edge::getFromID).collect(Collectors.toList());
            List<Node> availableNodes = toIDs.stream().distinct().filter(fromIDs::contains)
                    .map(ID -> graph.getNodeList().stream().filter(node -> Objects.equals(node.getID(), ID)).findFirst().orElseThrow(() -> new RuntimeException("Node with ID " + ID + " not found!"))).filter(node -> !node.getState().equals(NodeState.OCCUPIED)).collect(Collectors.toList());
            if (availableNodes.size() < robotComponent.getValue().size()) {
                throw new RuntimeException(robotComponent.getKey() + " component is fully occupied, but there are pending robots!");
            }
        }
    }

}
