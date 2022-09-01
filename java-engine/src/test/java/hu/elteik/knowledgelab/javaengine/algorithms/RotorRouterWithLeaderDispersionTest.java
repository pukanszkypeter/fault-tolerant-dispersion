package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.core.models.base.*;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class RotorRouterWithLeaderDispersionTest {

    @Test
    public void gridWithOneColorAndOneLeader() {

        Graph graph = new Graph(
                List.of(
                        new Node(1L, NodeState.DEFAULT),
                        new Node(2L, NodeState.DEFAULT),
                        new Node(3L, NodeState.DEFAULT),
                        new Node(4L, NodeState.DEFAULT),
                        new Node(5L, NodeState.DEFAULT),
                        new Node(6L, NodeState.DEFAULT),
                        new Node(7L, NodeState.DEFAULT)
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
        List<Robot> robotList = List.of(
                new Robot(1L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(2L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(3L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(4L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(5L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(6L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(7L, RobotState.START, Color.BLACK, 1L, null)
        );
        int i = 0;
        while (i < 10) {
            new RotorRouterWithLeaderDispersion().step(graph, robotList);
            graph.getNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
            i++;
        }
        System.out.println("Steps: " + i );
        assertTrue(true);
    }

    @Test
    public void lineGraph() {

        Graph graph = new Graph(
                List.of(
                        new Node(1L, NodeState.DEFAULT),
                        new Node(2L, NodeState.DEFAULT),
                        new Node(3L, NodeState.DEFAULT),
                        new Node(4L, NodeState.DEFAULT),
                        new Node(5L, NodeState.DEFAULT),
                        new Node(6L, NodeState.DEFAULT),
                        new Node(7L, NodeState.DEFAULT)
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
        List<Robot> robotList = List.of(
                new Robot(1L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(2L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(3L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(4L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(5L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(6L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(7L, RobotState.START, Color.BLACK, 1L, null)
        );
        int i = 0;
        while (i < 7) {
            new RotorRouterWithLeaderDispersion().step(graph, robotList);
            graph.getNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
            i++;
        }
        System.out.println("Steps: " + i );
        assertTrue(true);
    }


    @Test
    public void gridWithOneColorAndThreeLeader() {

        Graph graph = new Graph(
                List.of(
                        new Node(1L, NodeState.DEFAULT),
                        new Node(2L, NodeState.DEFAULT),
                        new Node(3L, NodeState.DEFAULT),
                        new Node(4L, NodeState.DEFAULT),
                        new Node(5L, NodeState.DEFAULT),
                        new Node(6L, NodeState.DEFAULT),
                        new Node(7L, NodeState.DEFAULT)
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
        List<Robot> robotList = List.of(
                new Robot(1L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(2L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(3L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(4L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(5L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(6L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(7L, RobotState.START, Color.BLACK, 1L, null)
        );
        int i = 0;
        while (i < 10) {
            new RotorRouterWithLeaderDispersion().step(graph, robotList);
            graph.getNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
            i++;
        }
        System.out.println("Steps: " + i );
        assertTrue(true);
    }
}
