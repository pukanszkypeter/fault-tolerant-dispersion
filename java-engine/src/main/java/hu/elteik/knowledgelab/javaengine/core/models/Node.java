package hu.elteik.knowledgelab.javaengine.core.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {

    private Long ID;
    private NodeState state;

}
