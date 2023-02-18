package hu.elte.ik.backend.module.algorithm.utils;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.graph.Edge;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.graph.Node;
import java.util.List;

public interface Stepper<
  NodeType extends Node, EdgeType extends Edge, RobotType extends Robot
> {
  void step(Graph<NodeType, EdgeType> graph, List<RobotType> robotList);
}
