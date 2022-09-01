package hu.elteik.knowledgelab.javaengine.core.models.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Graph {

    private List<Node> nodeList;
    private List<Edge> edgeList;

}
