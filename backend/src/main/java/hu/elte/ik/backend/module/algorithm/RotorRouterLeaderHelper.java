package hu.elte.ik.backend.module.algorithm;

import java.util.List;

import org.springframework.stereotype.Component;

import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;

@Component
public class RotorRouterLeaderHelper
                implements Stepper<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> {

        @Override
        public void step(Graph<RotorRouterLeaderNode, RotorRouterLeaderEdge> graph,
                        List<RotorRouterLeaderRobot> robotList) {
                look(graph, robotList);
                compute(graph, robotList);
                move(graph, robotList);
        }

        private static void look(Graph<RotorRouterLeaderNode, RotorRouterLeaderEdge> graph,
                        List<RotorRouterLeaderRobot> robotList) {
        }

        private static void compute(Graph<RotorRouterLeaderNode, RotorRouterLeaderEdge> graph,
                        List<RotorRouterLeaderRobot> robotList) {
        }

        private static void move(Graph<RotorRouterLeaderNode, RotorRouterLeaderEdge> graph,
                        List<RotorRouterLeaderRobot> robotList) {
        }

}
