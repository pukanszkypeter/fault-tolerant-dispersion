package hu.elteik.knowledgelab.javaengine.core.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Edge {

    private Long ID;
    private Long fromID;
    private Long toID;
    private Color color;

}
