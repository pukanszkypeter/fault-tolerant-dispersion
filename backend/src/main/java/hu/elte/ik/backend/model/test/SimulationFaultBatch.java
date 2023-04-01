package hu.elte.ik.backend.model.test;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.graph.Edge;
import hu.elte.ik.backend.model.graph.Node;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class SimulationFaultBatch<
  NodeType extends Node, EdgeType extends Edge, RobotType extends Robot
>
  extends SimulationBatch<NodeType, EdgeType, RobotType> {

  private Integer faults;
  private Double probability;
}
