package hu.elteik.knowledgelab.javaengine.core.models.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Robot {

    protected Long ID;
    protected RobotState state;
    protected Color color;
    protected Long onID;
    protected Long destinationID;

}
