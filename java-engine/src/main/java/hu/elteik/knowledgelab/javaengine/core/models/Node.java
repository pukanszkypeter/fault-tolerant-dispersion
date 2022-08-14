package hu.elteik.knowledgelab.javaengine.core.models;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {

    private Long ID;
    private NodeState state;
    private Long lastPortIndex;
    private Map<Color, Long> currentComponentPointer;

    public Node(Long ID, NodeState state) {
        this.ID = ID;
        this.state = state;
    }

}
