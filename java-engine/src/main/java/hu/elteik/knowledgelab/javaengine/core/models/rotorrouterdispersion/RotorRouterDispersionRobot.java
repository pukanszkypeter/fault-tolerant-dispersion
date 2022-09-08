package hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion;

import hu.elteik.knowledgelab.javaengine.core.models.base.Color;
import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionRobot extends Robot {

    private Long lastUsedEdgeID;

    public RotorRouterDispersionRobot(Long ID, RobotState state, Color color, Long onID, Long destinationID, Long lastUsedEdgeID) {
        super(ID, state, color, onID, destinationID);
        this.lastUsedEdgeID = lastUsedEdgeID;
    }
}
