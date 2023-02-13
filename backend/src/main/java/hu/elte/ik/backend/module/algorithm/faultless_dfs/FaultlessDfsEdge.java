package hu.elte.ik.backend.module.algorithm.faultless_dfs;

import hu.elte.ik.backend.model.graph.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultlessDfsEdge extends Edge {

    private int fromPort;
    private int toPort;

}
