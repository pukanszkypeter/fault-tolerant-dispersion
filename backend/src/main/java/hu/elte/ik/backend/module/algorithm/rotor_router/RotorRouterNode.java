package hu.elte.ik.backend.module.algorithm.rotor_router;

import hu.elte.ik.backend.model.graph.Node;
import hu.elte.ik.backend.model.graph.NodeState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class RotorRouterNode extends Node {

  private Long rotorRouter;

  public RotorRouterNode(Long id, NodeState state, Long rotorRouter) {
    super(id, state);
    this.rotorRouter = rotorRouter;
  }

  public RotorRouterNode(Node that, Long rotorRouter) {
    super(that);
    this.rotorRouter = rotorRouter;
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public RotorRouterNode(RotorRouterNode that) {
    super(that);
  }
}
