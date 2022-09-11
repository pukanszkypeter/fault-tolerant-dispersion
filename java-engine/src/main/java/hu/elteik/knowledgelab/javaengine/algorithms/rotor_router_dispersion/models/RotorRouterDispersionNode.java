package hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.models;

import java.util.Map;

import hu.elteik.knowledgelab.javaengine.core.models.Node;
import hu.elteik.knowledgelab.javaengine.core.utils.Color;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper=false)
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionNode extends Node {
    
    private Map<Color, Long> rotorRouter;
    
}
