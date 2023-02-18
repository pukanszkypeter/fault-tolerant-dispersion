package hu.elte.ik.backend.model.algorithm;

import hu.elte.ik.backend.model.utils.RobotState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Robot {

  private Long id;
  private Long onId;
  private RobotState state;
}
