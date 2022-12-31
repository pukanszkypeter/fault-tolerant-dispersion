package engine.generators.others;

import java.util.Map;

import org.jgrapht.Graph;
import org.jgrapht.generate.GraphGenerator;

public class BarbellGraphGenerator<V, E> implements GraphGenerator<V, E, V> {

    private int size;

    /**
     * Construct a new BarbellGraphGenerator.
     *
     * @param size number of vertices to be generated
     *
     * @throws IllegalArgumentException if the specified size is negative.
     */
    public BarbellGraphGenerator(int size)
    {
        if (size < 0) {
            throw new IllegalArgumentException("must be non-negative");
        } else if (size % 3 != 0) {
            throw new IllegalArgumentException("must be multiple of 3");
        }

        this.size = size;
    }

    @Override
    @SuppressWarnings (value="unchecked")
    public void generateGraph(Graph<V, E> target, Map<String, V> resultMap) {
        
        for (int i = 0; i < size; i++) {
            target.addVertex();
        }

        for (int i = 0; i < size / 3 - 1; ++i) {
            for (int j = i + 1; j < size / 3; ++j) {
              target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf(j + 1));
              target.addEdge((V) Long.valueOf((i + (2 * size) / 3) + 1), (V) Long.valueOf((j + (2 * size) / 3) + 1));
            }
          }
      
        for (int i = size / 3 - 1; i < (2 * size) / 3; ++i) {
            target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf((i + 1) + 1));
        }

    }
    
}
