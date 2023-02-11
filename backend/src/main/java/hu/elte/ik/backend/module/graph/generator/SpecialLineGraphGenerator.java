package hu.elte.ik.backend.module.graph.generator;

import java.util.Map;

import org.jgrapht.Graph;
import org.jgrapht.generate.GraphGenerator;

public class SpecialLineGraphGenerator<V, E> implements GraphGenerator<V, E, V> {

  private int size;

  /**
   * Construct a new SpecialLineGraphGenerator.
   *
   * @param size number of vertices to be generated
   *
   * @throws IllegalArgumentException if the specified size is negative.
   */
  public SpecialLineGraphGenerator(int size) {
    if (size < 0) {
      throw new IllegalArgumentException("must be non-negative");
    }

    this.size = size;
  }

  @Override
  @SuppressWarnings(value = "unchecked")
  public void generateGraph(Graph<V, E> target, Map<String, V> resultMap) {

    for (int i = 0; i < size; i++) {
      target.addVertex();
    }

    for (int i = 0; i < size; ++i) {
      if (i % 2 == 0) {
        if (i > 0) {
          target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf((i - 2) + 1));
        }
        if (i > 0 && i < size - 1) {
          target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf((i + 1) + 1));
        }
      } else {
        target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf((i - 1) + 1));
      }
    }

  }

}
