package hu.elteik.knowledgelab.javaengine.core.global_models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalGraph {
    
    private List<GlobalNode> nodeList;
    private List<GlobalEdge> edgeList;

}
