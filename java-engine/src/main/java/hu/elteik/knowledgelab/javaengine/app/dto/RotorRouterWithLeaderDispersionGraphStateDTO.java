package hu.elteik.knowledgelab.javaengine.app.dto;

import hu.elteik.knowledgelab.javaengine.core.models.base.Edge;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderNode;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderRobot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterWithLeaderDispersionGraphStateDTO {

    private List<RotorRouterWithLeaderNode> nodes;
    private List<Edge> edges;
    private List<RotorRouterWithLeaderRobot> robots;
    private int counter;
}
