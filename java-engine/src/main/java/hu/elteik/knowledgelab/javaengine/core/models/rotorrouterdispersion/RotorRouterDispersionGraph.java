package hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion;

import hu.elteik.knowledgelab.javaengine.core.models.base.Edge;
import hu.elteik.knowledgelab.javaengine.core.models.base.Graph;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionGraph extends Graph {

    private List<RotorRouterDispersionNode> rotorRouterDispersionNodeList;

    public RotorRouterDispersionGraph(List<RotorRouterDispersionNode> nodes, List<Edge> edges) {
        this.rotorRouterDispersionNodeList = nodes;
        this.edgeList = edges;
    }
}
