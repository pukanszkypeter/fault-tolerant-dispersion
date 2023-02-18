package hu.elte.ik.backend.module.algorithm;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RandomLeaderHelper
  implements Stepper<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> {

  @Override
  public void step(
    Graph<RandomLeaderNode, RandomLeaderEdge> graph,
    List<RandomLeaderRobot> robotList
  ) {
    look(graph, robotList);
    compute(graph, robotList);
    move(graph, robotList);
  }

  private static void look(
    Graph<RandomLeaderNode, RandomLeaderEdge> graph,
    List<RandomLeaderRobot> robotList
  ) {}

  private static void compute(
    Graph<RandomLeaderNode, RandomLeaderEdge> graph,
    List<RandomLeaderRobot> robotList
  ) {}

  private static void move(
    Graph<RandomLeaderNode, RandomLeaderEdge> graph,
    List<RandomLeaderRobot> robotList
  ) {}
}
