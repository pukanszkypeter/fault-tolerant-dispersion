package hu.elteik.knowledgelab.javaengine.core.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Graph<NodeType extends Node, EdgeType extends Edge> {

    private List<NodeType> nodeList;
    private List<EdgeType> edgeList;

}
