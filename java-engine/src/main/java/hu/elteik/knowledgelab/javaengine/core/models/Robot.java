package hu.elteik.knowledgelab.javaengine.core.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Robot {

    private Long ID;
    private RobotState state;
    private Color color;
    private Long onID;
    private Long destinationID;
    private Long lastUsedEdgeID; // For the rotor router model

    public Robot(Long ID, RobotState state, Color color, Long onID, Long destinationID) {
        this.ID = ID;
        this.state = state;
        this.color = color;
        this.onID = onID;
        this.destinationID = destinationID;
    }
}
