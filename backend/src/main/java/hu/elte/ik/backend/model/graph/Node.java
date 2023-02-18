package hu.elte.ik.backend.model.graph;

import hu.elte.ik.backend.model.utils.NodeState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {

  private Long id;
  private NodeState state;
}
