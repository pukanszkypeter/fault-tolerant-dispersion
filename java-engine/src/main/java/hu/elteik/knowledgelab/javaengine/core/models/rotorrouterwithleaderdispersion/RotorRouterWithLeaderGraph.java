package hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion;

import hu.elteik.knowledgelab.javaengine.core.models.base.Edge;
import hu.elteik.knowledgelab.javaengine.core.models.base.Graph;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterWithLeaderGraph extends Graph {

    private List<RotorRouterWithLeaderNode> RotorRouterWithLeaderNodeList;

    public RotorRouterWithLeaderGraph(List<RotorRouterWithLeaderNode> nodes, List<Edge> edges) {
        this.RotorRouterWithLeaderNodeList = nodes;
        this.edgeList = edges;
    }
}
