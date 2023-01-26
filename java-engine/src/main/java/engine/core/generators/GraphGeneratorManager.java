package engine.core.generators;

import org.jgrapht.generate.GraphGenerator;

import engine.core.models.Edge;
import engine.core.models.Graph;
import engine.core.models.Node;

public interface GraphGeneratorManager {
    
    public Graph<Node, Edge> generateGraph(GraphGenerator<Long, Long, Long> generator);

}
