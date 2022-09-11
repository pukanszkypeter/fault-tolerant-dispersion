package hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion.models;

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
public class RandomWithLeaderDispersionEdge extends Edge {
    
    private Color color;

}
