package hu.elteik.knowledgelab.javaengine.app.dto;

import hu.elteik.knowledgelab.javaengine.core.models.base.Edge;
import hu.elteik.knowledgelab.javaengine.core.models.base.Node;
import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GraphStateDTO {

    private List<Node> nodes;
    private List<Edge> edges;
    private List<Robot> robots;
    private int counter;
    
}
