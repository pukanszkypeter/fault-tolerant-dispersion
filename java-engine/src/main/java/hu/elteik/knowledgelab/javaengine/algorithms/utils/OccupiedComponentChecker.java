package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import hu.elteik.knowledgelab.javaengine.core.models.base.*;

public class OccupiedComponentChecker<Object extends Graph> {
    
    public boolean run(Object graph, Color component) {
        List<Edge> componentEdges = graph.getEdgeList().stream().filter(edge -> edge.getColor().equals(component)).collect(Collectors.toList());
        
        List<Node> componentNodes = new ArrayList<>();
        for (Edge edge : componentEdges) {
            Node fromNode = graph.getNodeList().stream().filter(node -> node.getID().equals(edge.getFromID())).findAny().orElseThrow(() -> new RuntimeException("Node with ID " + edge.getFromID() + " not found!"));
            Node toNode = graph.getNodeList().stream().filter(node -> node.getID().equals(edge.getToID())).findAny().orElseThrow(() -> new RuntimeException("Node with ID " + edge.getToID() + " not found!"));
            if (!componentNodes.contains(fromNode)) {
                componentNodes.add(fromNode);
            }
            if (!componentNodes.contains(toNode)) {
                componentNodes.add(toNode);
            }
        }

        return componentNodes.size() == componentNodes.stream().filter(node -> node.getState().equals(NodeState.OCCUPIED)).count();
    }
}
