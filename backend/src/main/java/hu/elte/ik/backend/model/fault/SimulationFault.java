package hu.elte.ik.backend.model.fault;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.graph.Edge;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.graph.Node;
import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.model.simulation.SimulationState;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class SimulationFault<
  NodeType extends Node, EdgeType extends Edge, RobotType extends Robot
>
  extends Simulation<NodeType, EdgeType, RobotType> {

  private Integer faults;
  private Double probability;

  public SimulationFault(
    Long steps,
    SimulationState state,
    Graph<NodeType, EdgeType> graph,
    List<RobotType> robots,
    Integer faults,
    Double probability
  ) {
    super(steps, state, graph, robots);
    this.faults = faults;
    this.probability = probability;
  }
}
