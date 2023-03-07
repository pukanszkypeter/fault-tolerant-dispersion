package hu.elte.ik.backend.model.algorithm;

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

  public Robot(Robot that) {
    this(that.getId(), that.getOnId(), that.getState());
  }
}
