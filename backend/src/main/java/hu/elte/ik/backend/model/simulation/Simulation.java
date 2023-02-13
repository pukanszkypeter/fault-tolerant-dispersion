package hu.elte.ik.backend.model.simulation;

import java.util.List;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.graph.Edge;
import hu.elte.ik.backend.model.graph.Graph;
import hu.elte.ik.backend.model.graph.Node;
import hu.elte.ik.backend.model.utils.SimulationState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Simulation<NodeType extends Node, EdgeType extends Edge, RobotType extends Robot> {

        private Long step;
        private SimulationState state;
        private Graph<NodeType, EdgeType> graph;
        private List<RobotType> robots;

}
