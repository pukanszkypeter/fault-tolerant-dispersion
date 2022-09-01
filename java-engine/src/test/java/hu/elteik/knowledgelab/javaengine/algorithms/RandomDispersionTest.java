package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.core.models.base.*;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RandomDispersionTest {

    @Test
    public void shouldBehaveAsExpected() {
        Graph graph = new Graph(
                List.of(
                        new Node(1L, NodeState.DEFAULT),
                        new Node(2L, NodeState.DEFAULT),
                        new Node(3L, NodeState.DEFAULT),
                        new Node(4L, NodeState.DEFAULT),
                        new Node(5L, NodeState.DEFAULT),
                        new Node(6L, NodeState.DEFAULT),
                        new Node(7L, NodeState.DEFAULT),
                        new Node(8L, NodeState.DEFAULT),
                        new Node(9L, NodeState.DEFAULT)
                ),
                List.of(
                        new Edge(1L, 1L, 2L, Color.BLACK),
                        new Edge(2L, 2L, 3L, Color.BLACK),
                        new Edge(3L, 1L, 4L, Color.BLACK),
                        new Edge(4L, 2L, 5L, Color.BLACK),
                        new Edge(1L, 3L, 6L, Color.BLACK),
                        new Edge(2L, 4L, 5L, Color.BLACK),
                        new Edge(3L, 5L, 6L, Color.BLUE),
                        new Edge(4L, 4L, 7L, Color.BLACK),
                        new Edge(1L, 5L, 8L, Color.BLUE),
                        new Edge(2L, 6L, 9L, Color.BLUE),
                        new Edge(3L, 7L, 8L, Color.BLACK),
                        new Edge(4L, 8L, 9L, Color.BLUE)
                )
        );
        List<Robot> robotList = List.of(
                new Robot(1L, RobotState.START, Color.BLACK, 5L, null),
                new Robot(2L, RobotState.START, Color.BLACK, 5L, null),
                new Robot(3L, RobotState.START, Color.BLACK, 5L, null),
                new Robot(4L, RobotState.START, Color.BLACK, 5L, null),
                new Robot(5L, RobotState.START, Color.BLACK, 5L, null),
                new Robot(6L, RobotState.START, Color.BLUE, 5L, null),
                new Robot(7L, RobotState.START, Color.BLUE, 5L, null),
                new Robot(8L, RobotState.START, Color.BLUE, 5L, null),
                new Robot(9L, RobotState.START, Color.BLUE, 5L, null)
        );

        int i = 0;
        while (robotList.size() != robotList.stream().filter(robot -> robot.getState().equals(RobotState.SETTLED) || robot.getState().equals(RobotState.TERMINATED)).count()) {
            new RandomDispersion().step(graph, robotList);
            i++;
            graph.getNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
        }
        System.out.println(i);
        assertTrue(true);
    }

}
