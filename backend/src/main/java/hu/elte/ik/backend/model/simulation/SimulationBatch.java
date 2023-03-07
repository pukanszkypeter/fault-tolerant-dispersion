package hu.elte.ik.backend.model.simulation;

import hu.elte.ik.backend.model.algorithm.AlgorithmType;
import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.graph.Edge;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.graph.GraphType;
import hu.elte.ik.backend.model.graph.Node;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimulationBatch<
  NodeType extends Node, EdgeType extends Edge, RobotType extends Robot
> {

  private GraphType graphType;

  private Graph<NodeType, EdgeType> graph;

  private AlgorithmType algorithmType;

  private List<RobotType> robots;

  private Integer numOfTests;
}
