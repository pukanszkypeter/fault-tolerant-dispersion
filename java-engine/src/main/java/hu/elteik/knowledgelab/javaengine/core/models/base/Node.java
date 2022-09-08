package hu.elteik.knowledgelab.javaengine.core.models.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {

    protected Long ID;
    protected NodeState state;
}
