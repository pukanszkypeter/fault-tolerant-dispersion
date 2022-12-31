package engine.core.generators;

import engine.core.models.Edge;
import engine.core.models.Graph;
import engine.core.models.Node;
import engine.core.utils.GraphType;

public interface GraphGeneratorManager {
    
    public Graph<Node, Edge> generateGraph(GraphType type, int size);

}
