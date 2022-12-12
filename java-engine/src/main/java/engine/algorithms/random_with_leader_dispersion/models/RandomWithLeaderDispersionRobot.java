package engine.algorithms.random_with_leader_dispersion.models;

import engine.core.models.Robot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class RandomWithLeaderDispersionRobot extends Robot {

    private Long onID;
    private Long destinationID;

}
