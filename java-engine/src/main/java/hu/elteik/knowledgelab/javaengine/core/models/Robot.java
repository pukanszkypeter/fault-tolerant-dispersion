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

}
