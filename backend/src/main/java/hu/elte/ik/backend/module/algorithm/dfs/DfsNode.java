package hu.elte.ik.backend.module.algorithm.dfs;

import hu.elte.ik.backend.model.graph.Node;
import hu.elte.ik.backend.model.graph.NodeState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class DfsNode extends Node {

  public DfsNode(Long id, NodeState state) {
    super(id, state);
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public DfsNode(DfsNode that) {
    super(that);
  }
}
