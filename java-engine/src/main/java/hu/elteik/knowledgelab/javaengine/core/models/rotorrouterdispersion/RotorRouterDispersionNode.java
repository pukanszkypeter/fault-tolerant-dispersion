package hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion;

import hu.elteik.knowledgelab.javaengine.core.models.base.Color;
import hu.elteik.knowledgelab.javaengine.core.models.base.Node;
import hu.elteik.knowledgelab.javaengine.core.models.base.NodeState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionNode extends Node {

    private Map<Color, Long> currentComponentPointer;

    public RotorRouterDispersionNode(Long ID, NodeState state, Map<Color, Long> currentComponentPointer) {
        super(ID, state);
        this.currentComponentPointer = currentComponentPointer;
    }
}
