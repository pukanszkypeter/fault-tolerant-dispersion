package hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.models;

import hu.elteik.knowledgelab.javaengine.core.models.Edge;
import hu.elteik.knowledgelab.javaengine.core.utils.Color;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper=false)
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionEdge extends Edge {
    
    private Color color;
    
}
