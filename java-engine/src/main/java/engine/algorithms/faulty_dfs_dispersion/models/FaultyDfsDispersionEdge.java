package engine.algorithms.faulty_dfs_dispersion.models;

import engine.core.models.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultyDfsDispersionEdge extends Edge {

    private int fromPort;
    private int toPort;
    
}
