package hu.elteik.knowledgelab.javaengine.core.algorithms;

import java.util.List;

import hu.elteik.knowledgelab.javaengine.core.models.*;

public interface RotorRouterDispersionManager<NodeType extends Node, EdgeType extends Edge, RobotType extends Robot> {
    
    public void step(Graph<NodeType, EdgeType> graph, List<RobotType> robotList);

}
