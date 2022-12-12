package engine.algorithms.faultless_dfs_dispersion.models;

import engine.core.models.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultlessDfsDispersionEdge extends Edge {

    private int fromPort;
    private int toPort;

}
