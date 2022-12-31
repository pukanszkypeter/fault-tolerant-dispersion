package engine.app;

import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.ApplicationScope;

import engine.core.generators.GraphGeneratorManager;
import engine.core.models.Edge;
import engine.core.models.Graph;
import engine.core.models.Node;
import engine.core.utils.GraphType;

@Service
@ApplicationScope
public class GraphGeneratorService {
    
    private final GraphGeneratorManager graphGeneratorManager;

    public GraphGeneratorService(GraphGeneratorManager graphGeneratorManager) {
        this.graphGeneratorManager = graphGeneratorManager;
    }

    public Graph<Node, Edge> generateGraph(GraphType type, int size) {
        return graphGeneratorManager.generateGraph(type, size);
    }
    
}
