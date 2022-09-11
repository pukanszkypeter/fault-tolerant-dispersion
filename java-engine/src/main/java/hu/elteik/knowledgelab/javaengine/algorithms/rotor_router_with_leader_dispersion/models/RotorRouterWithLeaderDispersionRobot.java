package hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_with_leader_dispersion.models;

import hu.elteik.knowledgelab.javaengine.core.models.Robot;
import hu.elteik.knowledgelab.javaengine.core.utils.Color;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper=false)
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterWithLeaderDispersionRobot extends Robot {
    
    private Color color;
    private Long onID;
    private Long destinationID;
    private Long lastUsedEdgeID;

}
