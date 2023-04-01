package hu.elte.ik.backend.module.algorithm.dfs;

import hu.elte.ik.backend.model.graph.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class DfsEdge extends Edge {

  private int fromPort;
  private int toPort;

  public DfsEdge(Long id, Long fromId, Long toId, int fromPort, int toPort) {
    super(id, fromId, toId);
    this.fromPort = fromPort;
    this.toPort = toPort;
  }

  public DfsEdge(DfsEdge that, int fromPort, int toPort) {
    super(that);
    this.fromPort = fromPort;
    this.toPort = toPort;
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public DfsEdge(DfsEdge that) {
    super(that);
  }
}
