package hu.elte.ik.backend.module.algorithm.dfs;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.algorithm.RobotState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class DfsRobot extends Robot {

  private int parent;
  private int child;
  private int lastUsedPort;

  public DfsRobot(
    Long id,
    Long onId,
    RobotState state,
    int parent,
    int child,
    int lastUsedPort
  ) {
    super(id, onId, state);
    this.parent = parent;
    this.child = child;
    this.lastUsedPort = lastUsedPort;
  }

  public DfsRobot(DfsRobot that, int parent, int child, int lastUsedPort) {
    super(that);
    this.parent = parent;
    this.child = child;
    this.lastUsedPort = lastUsedPort;
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public DfsRobot(DfsRobot that) {
    super(that);
  }
}
