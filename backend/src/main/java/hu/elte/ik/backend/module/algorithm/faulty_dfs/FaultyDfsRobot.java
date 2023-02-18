package hu.elte.ik.backend.module.algorithm.faulty_dfs;

import hu.elte.ik.backend.model.algorithm.Robot;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultyDfsRobot extends Robot {

  private int parent;
  private int child;
  private int lastUsedPort;
  private RobotPhase phase;
  private Long treeLabel;
  private boolean emptyBefore;
}
