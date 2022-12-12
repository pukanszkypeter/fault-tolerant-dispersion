package engine.core.models;

import engine.core.utils.RobotState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Robot {

    private Long ID;
    private RobotState state;

}
