package hu.elteik.knowledgelab.javaengine.app.dto;

import java.util.List;

import hu.elteik.knowledgelab.javaengine.core.models.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimulationStep<NodeType extends Node, EdgeType extends Edge, RobotType extends Robot> {

    // Meta
    private AlgorithmType algorithmType;
    private SimulationState simulationState;
    private Long step;

    // Model(s)
    private Graph<NodeType, EdgeType> graph;
    private List<RobotType> robotList;
    
}
