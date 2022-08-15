package hu.elteik.knowledgelab.javaengine.app.dto;

import hu.elteik.knowledgelab.javaengine.core.models.*;
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
