package hu.elte.ik.backend.module.algorithm.faulty_dfs;

import hu.elte.ik.backend.model.graph.Edge;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FaultyDfsEdge extends Edge {

    private int fromPort;
    private int toPort;

}
