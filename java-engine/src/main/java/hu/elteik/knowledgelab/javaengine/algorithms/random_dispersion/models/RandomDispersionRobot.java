package hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion.models;

import hu.elteik.knowledgelab.javaengine.core.models.Robot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class RandomDispersionRobot extends Robot {

    private Long onID;
    private Long destinationID;

}
