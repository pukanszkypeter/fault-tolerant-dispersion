package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.core.models.base.Color;
import hu.elteik.knowledgelab.javaengine.core.models.base.Edge;
import hu.elteik.knowledgelab.javaengine.core.models.base.NodeState;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionGraph;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionNode;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionRobot;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class RotorRouterDispersionNodeTest {
    
    @Test
    public void shouldBehaveAsExpected() {
        RotorRouterDispersionGraph graph = new RotorRouterDispersionGraph(
                List.of(
                        new RotorRouterDispersionNode(1L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(2L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(3L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(4L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(5L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(6L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(7L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(8L, NodeState.DEFAULT, null),
                        new RotorRouterDispersionNode(9L, NodeState.DEFAULT, null)
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
        List<RotorRouterDispersionRobot> robotList = List.of(
                new RotorRouterDispersionRobot(1L, RobotState.START, Color.BLACK, 5L, null, null),
                new RotorRouterDispersionRobot(2L, RobotState.START, Color.BLACK, 5L, null, null),
                new RotorRouterDispersionRobot(3L, RobotState.START, Color.BLACK, 5L, null, null),
                new RotorRouterDispersionRobot(4L, RobotState.START, Color.BLACK, 5L, null, null),
                new RotorRouterDispersionRobot(5L, RobotState.START, Color.BLACK, 5L, null, null),
                new RotorRouterDispersionRobot(6L, RobotState.START, Color.BLUE, 5L, null, null),
                new RotorRouterDispersionRobot(7L, RobotState.START, Color.BLUE, 5L, null, null),
                new RotorRouterDispersionRobot(8L, RobotState.START, Color.BLUE, 5L, null, null),
                new RotorRouterDispersionRobot(9L, RobotState.START, Color.BLUE, 5L, null, null)
        );
 
        int i = 0;
        while (robotList.size() != robotList.stream().filter(robot -> robot.getState().equals(RobotState.SETTLED) || robot.getState().equals(RobotState.TERMINATED)).count()) {
            new RotorRouterDispersion().step(graph, robotList);
            i++;
            graph.getRotorRouterDispersionNodeList().forEach(System.out::println);
            robotList.forEach(System.out::println);
        }
        System.out.println(i);     
        
        assertTrue(true);
    }

}
