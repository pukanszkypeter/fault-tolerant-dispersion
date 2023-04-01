package hu.elte.ik.backend.module.algorithm.random;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.algorithm.RobotState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class RandomRobot extends Robot {

  private Long destinationId;

  public RandomRobot(Long id, Long onId, RobotState state, Long destinationId) {
    super(id, onId, state);
    this.destinationId = destinationId;
  }

  public RandomRobot(RandomRobot that, Long destinationId) {
    super(that);
    this.destinationId = destinationId;
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public RandomRobot(RandomRobot that) {
    super(that);
  }
}
