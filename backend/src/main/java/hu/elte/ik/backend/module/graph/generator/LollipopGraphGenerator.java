package hu.elte.ik.backend.module.graph.generator;

import java.util.Map;

import org.jgrapht.Graph;
import org.jgrapht.generate.GraphGenerator;

public class LollipopGraphGenerator<V, E> implements GraphGenerator<V, E, V> {

    private int size;

    /**
     * Construct a new LollipopGraphGenerator.
     *
     * @param size number of vertices to be generated
     *
     * @throws IllegalArgumentException if the specified size is negative.
     */
    public LollipopGraphGenerator(int size) {
        if (size < 0) {
            throw new IllegalArgumentException("must be non-negative");
        } else if (size % 2 != 0) {
            throw new IllegalArgumentException("must be multiple of 2");
        }

        this.size = size;
    }

    @Override
    @SuppressWarnings(value = "unchecked")
    public void generateGraph(Graph<V, E> target, Map<String, V> resultMap) {

        for (int i = 0; i < size; i++) {
            target.addVertex();
        }

        for (int i = 0; i < size / 2 - 1; ++i) {
            for (int j = i + 1; j < size / 2; ++j) {
                target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf(j + 1));
            }
        }

        for (int i = size / 2 - 1; i < size - 1; ++i) {
            target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf((i + 1) + 1));
        }

    }

}
