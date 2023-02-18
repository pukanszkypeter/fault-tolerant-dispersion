package hu.elte.ik.backend.module.algorithm.random_leader;

import hu.elte.ik.backend.model.algorithm.Robot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class RandomLeaderRobot extends Robot {

  private Long destinationId;
}