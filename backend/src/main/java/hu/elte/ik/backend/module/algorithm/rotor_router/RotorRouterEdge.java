package hu.elte.ik.backend.module.algorithm.rotor_router;

import hu.elte.ik.backend.model.graph.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class RotorRouterEdge extends Edge {

  public RotorRouterEdge(Long id, Long fromId, Long toId) {
    super(id, fromId, toId);
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public RotorRouterEdge(RotorRouterEdge that) {
    super(that);
  }
}
