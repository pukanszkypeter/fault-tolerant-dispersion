package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.core.models.base.*;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderRobot;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderGraph;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderNode;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class RotorRouterWithLeaderDispersionTest {

    @Test
    public void gridWithOneColorAndOneLeader() {

        RotorRouterWithLeaderGraph graph = new RotorRouterWithLeaderGraph(
                List.of(
                        new RotorRouterWithLeaderNode(1L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(2L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(3L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(4L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(5L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(6L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(7L, NodeState.DEFAULT, null)
                ),
                List.of(
                        new Edge(1L, 1L, 2L, Color.BLACK),
                        new Edge(2L, 1L, 4L, Color.BLACK),
                        new Edge(3L, 2L, 5L, Color.BLACK),
                        new Edge(4L, 4L, 5L, Color.BLACK),
                        new Edge(5L, 5L, 6L, Color.BLACK),
                        new Edge(6L, 3L, 2L, Color.BLACK),
                        new Edge(7L, 3L, 6L, Color.BLACK),
                        new Edge(8L, 3L, 7L, Color.BLACK),
                        new Edge(9L, 7L, 6L, Color.BLACK)
                )
        );
        List<RotorRouterWithLeaderRobot> robotList = List.of(
                new RotorRouterWithLeaderRobot(1L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(2L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(3L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(4L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(5L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(6L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(7L, RobotState.START, Color.BLACK, 1L, null, null)
        );
        int i = 0;
        while (i < 10) {
            new RotorRouterWithLeaderDispersion().step(graph, robotList);
            graph.getRotorRouterWithLeaderNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
            i++;
        }
        System.out.println("Steps: " + i );
        assertTrue(true);
    }

    @Test
    public void lineRotorRouterWithLeaderGraph() {

        RotorRouterWithLeaderGraph graph = new RotorRouterWithLeaderGraph(
                List.of(
                        new RotorRouterWithLeaderNode(1L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(2L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(3L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(4L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(5L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(6L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(7L, NodeState.DEFAULT, null)
                ),
                List.of(
                        new Edge(1L, 1L, 2L, Color.BLACK),
                        new Edge(2L, 2L, 3L, Color.BLACK),
                        new Edge(3L, 3L, 4L, Color.BLACK),
                        new Edge(4L, 4L, 5L, Color.BLACK),
                        new Edge(5L, 5L, 6L, Color.BLACK),
                        new Edge(6L, 6L, 7L, Color.BLACK)
                )
        );
        List<RotorRouterWithLeaderRobot> robotList = List.of(
                new RotorRouterWithLeaderRobot(1L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(2L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(3L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(4L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(5L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(6L, RobotState.START, Color.BLACK, 1L, null, null),
                new RotorRouterWithLeaderRobot(7L, RobotState.START, Color.BLACK, 1L, null, null)
        );
        int i = 0;
        while (i < 7) {
            new RotorRouterWithLeaderDispersion().step(graph, robotList);
            graph.getRotorRouterWithLeaderNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
            i++;
        }
        System.out.println("Steps: " + i );
        assertTrue(true);
    }


    @Test
    public void gridWithOneColorAndThreeLeader() {

        RotorRouterWithLeaderGraph graph = new RotorRouterWithLeaderGraph(
                List.of(
                        new RotorRouterWithLeaderNode(1L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(2L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(3L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(4L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(5L, NodeState.DEFAULT, null),
                        new RotorRouterWithLeaderNode(6L, NodeState.DEFAULT, null)
                ),
                List.of(
                        new Edge(1L, 1L, 2L, Color.BLACK),
                        new Edge(2L, 1L, 3L, Color.BLACK),
                        new Edge(3L, 2L, 4L, Color.BLACK),
                        new Edge(4L, 2L, 4L, Color.BLUE),
                        new Edge(5L, 1L, 3L, Color.BLUE),
                        new Edge(6L, 3L, 4L, Color.BLUE),
                        new Edge(7L, 3L, 4L, Color.BLACK),
                        new Edge(8L, 4L, 6L, Color.BLACK),
                        new Edge(9L, 4L, 6L, Color.BLUE),
                        new Edge(10L, 5L, 6L, Color.BLUE),
                        new Edge(11L, 3L, 5L, Color.BLUE),
                        new Edge(12L, 3L, 5L, Color.BLACK)
                )
        );
        List<RotorRouterWithLeaderRobot> robotList = List.of(
                new RotorRouterWithLeaderRobot(1L, RobotState.START, Color.BLACK, 4L, null, null),
                new RotorRouterWithLeaderRobot(2L, RobotState.START, Color.BLACK, 4L, null, null),
                new RotorRouterWithLeaderRobot(3L, RobotState.START, Color.BLACK, 4L, null, null),
                new RotorRouterWithLeaderRobot(4L, RobotState.START, Color.BLACK, 4L, null, null),
                new RotorRouterWithLeaderRobot(5L, RobotState.START, Color.BLUE, 3L, null, null),
                new RotorRouterWithLeaderRobot(6L, RobotState.START, Color.BLUE, 3L, null, null),
                new RotorRouterWithLeaderRobot(7L, RobotState.START, Color.BLUE, 3L, null, null),
                new RotorRouterWithLeaderRobot(8L, RobotState.START, Color.BLUE, 3L, null, null)
        );
        int i = 0;
        while (i < 10) {
            new RotorRouterWithLeaderDispersion().step(graph, robotList);
            graph.getRotorRouterWithLeaderNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
            i++;
        }
        System.out.println("Steps: " + i );
        assertTrue(true);
    }
}
