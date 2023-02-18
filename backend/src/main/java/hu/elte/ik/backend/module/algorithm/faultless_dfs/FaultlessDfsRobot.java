package hu.elte.ik.backend.module.algorithm.faultless_dfs;

import hu.elte.ik.backend.model.algorithm.Robot;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultlessDfsRobot extends Robot {

  private int parent;
  private int child;
  private int lastUsedPort;
}
