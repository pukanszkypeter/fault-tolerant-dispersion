package hu.elte.ik.backend.module.algorithm.random;

import hu.elte.ik.backend.model.algorithm.Robot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class RandomRobot extends Robot {

  private Long destinationId;

  public RandomRobot(RandomRobot that) {
    super(that);
    this.destinationId = that.getDestinationId();
  }
}
