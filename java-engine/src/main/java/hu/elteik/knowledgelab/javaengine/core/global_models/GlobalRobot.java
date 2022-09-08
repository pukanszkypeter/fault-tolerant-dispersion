package hu.elteik.knowledgelab.javaengine.core.global_models;

import hu.elteik.knowledgelab.javaengine.core.models.Color;
import hu.elteik.knowledgelab.javaengine.core.models.RobotState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalRobot {
    
    private Long ID;
    private RobotState state;
    private Color color;
    private Long onID;
    private Long lastUsedEdgeID;

    private Long parentID;
    private Long childID;

    
}
