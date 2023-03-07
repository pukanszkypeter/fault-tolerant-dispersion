package hu.elte.ik.backend.module.algorithm.random;

import hu.elte.ik.backend.model.graph.Node;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class RandomNode extends Node {

  public RandomNode(RandomNode that) {
    super(that);
  }
}
