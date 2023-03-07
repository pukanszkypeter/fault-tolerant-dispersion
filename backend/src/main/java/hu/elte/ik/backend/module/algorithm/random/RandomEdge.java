package hu.elte.ik.backend.module.algorithm.random;

import hu.elte.ik.backend.model.graph.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class RandomEdge extends Edge {

  public RandomEdge(RandomEdge that) {
    super(that);
  }
}
