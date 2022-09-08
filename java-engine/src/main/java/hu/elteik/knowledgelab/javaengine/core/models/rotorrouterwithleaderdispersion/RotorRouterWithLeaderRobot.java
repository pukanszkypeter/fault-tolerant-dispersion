package hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion;

import hu.elteik.knowledgelab.javaengine.core.models.base.Color;
import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterWithLeaderRobot extends Robot {

    private Long lastUsedEdgeID;

    public RotorRouterWithLeaderRobot(Long ID, RobotState state, Color color, Long onID, Long destinationID, Long lastUsedEdgeID) {
        super(ID, state, color, onID, destinationID);
        this.lastUsedEdgeID = lastUsedEdgeID;
    }
}
