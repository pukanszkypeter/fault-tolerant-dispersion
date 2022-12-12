package engine.algorithms.faulty_dfs_dispersion.models;

import engine.core.models.Robot;
import engine.core.utils.RobotPhase;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultyDfsDispersionRobot extends Robot {

    private Long onID;
    private int parent;
    private int child;
    private int lastUsedPort;
    private RobotPhase phase;
    private Long treeLabel;
    private boolean emptyBefore;
    
}
