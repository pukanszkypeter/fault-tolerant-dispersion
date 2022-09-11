package hu.elteik.knowledgelab.javaengine.core.models;

import hu.elteik.knowledgelab.javaengine.core.utils.RobotState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Robot {

    private Long ID;
    private RobotState state;

}
