package engine.algorithms.faultless_dfs_dispersion.models;

import engine.core.models.Robot;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultlessDfsDispersionRobot extends Robot {

    private Long onID;
    private int parent;
    private int child;
    private int lastUsedPort;

}
