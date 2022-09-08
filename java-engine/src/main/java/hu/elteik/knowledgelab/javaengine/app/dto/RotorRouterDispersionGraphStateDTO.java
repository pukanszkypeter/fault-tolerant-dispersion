package hu.elteik.knowledgelab.javaengine.app.dto;

import hu.elteik.knowledgelab.javaengine.core.models.base.Edge;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionNode;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionRobot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionGraphStateDTO {

    private List<RotorRouterDispersionNode> nodes;
    private List<Edge> edges;
    private List<RotorRouterDispersionRobot> robots;
    private int counter;
}
