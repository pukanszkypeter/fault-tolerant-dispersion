package hu.elte.ik.backend.model.graph;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import hu.elte.ik.backend.model.utils.NodeState;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {

    private Long id;
    private NodeState state;

}
