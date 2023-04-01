package hu.elte.ik.backend.module.algorithm.rotor_router;

import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.model.algorithm.RobotState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class RotorRouterRobot extends Robot {

  private Long destinationId;

  public RotorRouterRobot(
    Long id,
    Long onId,
    RobotState state,
    Long destinationId
  ) {
    super(id, onId, state);
    this.destinationId = destinationId;
  }

  public RotorRouterRobot(RotorRouterRobot that, Long destinationId) {
    super(that);
    this.destinationId = destinationId;
  }

  /**
   * See
   * hu.elte.ik.backend.logic.TestServiceImpl.java
   * createSimulation()
   */
  public RotorRouterRobot(RotorRouterRobot that) {
    super(that);
  }
}
