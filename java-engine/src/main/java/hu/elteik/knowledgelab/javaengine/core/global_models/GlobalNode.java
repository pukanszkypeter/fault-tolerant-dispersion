package hu.elteik.knowledgelab.javaengine.core.global_models;

import hu.elteik.knowledgelab.javaengine.core.models.NodeState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalNode {
    
    private Long ID;
    private NodeState state;
    
}
