package hu.elte.ik.backend.module.algorithm;

import java.util.List;

import org.springframework.stereotype.Component;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;

@Component
public class RandomLeaderHelper implements Stepper<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> {

        @Override
        public void step(Graph<RandomLeaderNode, RandomLeaderEdge> graph, List<RandomLeaderRobot> robotList) {
                look(graph, robotList);
                compute(graph, robotList);
                move(graph, robotList);
        }

        private static void look(Graph<RandomLeaderNode, RandomLeaderEdge> graph,
                        List<RandomLeaderRobot> robotList) {
        }

        private static void compute(Graph<RandomLeaderNode, RandomLeaderEdge> graph,
                        List<RandomLeaderRobot> robotList) {
        }

        private static void move(Graph<RandomLeaderNode, RandomLeaderEdge> graph,
                        List<RandomLeaderRobot> robotList) {
        }

}
