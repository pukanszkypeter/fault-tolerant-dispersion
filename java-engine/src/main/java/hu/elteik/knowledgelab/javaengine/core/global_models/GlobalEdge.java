package hu.elteik.knowledgelab.javaengine.core.global_models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import hu.elteik.knowledgelab.javaengine.core.models.Color;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalEdge {
    
    private Long ID;
    private Long fromID;
    private Long toID;
    private Color color;
    
}
