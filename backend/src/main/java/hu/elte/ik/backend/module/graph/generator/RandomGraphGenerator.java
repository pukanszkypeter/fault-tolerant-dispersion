package hu.elte.ik.backend.module.graph.generator;

import java.util.Map;
import org.jgrapht.Graph;
import org.jgrapht.generate.GraphGenerator;

public class RandomGraphGenerator<V, E> implements GraphGenerator<V, E, V> {

  private int size;

  /**
   * Construct a new RandomGraphGenerator.
   *
   * @param size number of vertices to be generated
   *
   * @throws IllegalArgumentException if the specified size is negative.
   */
  public RandomGraphGenerator(int size) {
    if (size < 0) {
      throw new IllegalArgumentException("must be non-negative");
    }

    this.size = size;
  }

  @Override
  @SuppressWarnings(value = "unchecked")
  public void generateGraph(Graph<V, E> target, Map<String, V> resultMap) {
    Double p = (Math.log(size) / Math.log(2)) / size;
    DisjointSet disjointSet = new DisjointSet(size);

    for (int i = 0; i < size; i++) {
      target.addVertex();
    }

    while (disjointSet.numberOfComponents > 1) {
      for (int i = 0; i < size; ++i) {
        for (int j = 0; j < size; ++j) {
          if (i != j && Math.random() <= p) {
            target.addEdge((V) Long.valueOf(i + 1), (V) Long.valueOf(j + 1));
            disjointSet.unionComponents(i, j);
          }
        }
      }
    }
  }
}
