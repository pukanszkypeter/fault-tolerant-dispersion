package hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_with_leader_dispersion.models;

import hu.elteik.knowledgelab.javaengine.core.models.Node;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper=false)
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterWithLeaderDispersionNode extends Node {
    
    private Long rotorRouter;

}
