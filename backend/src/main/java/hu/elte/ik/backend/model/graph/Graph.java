package hu.elte.ik.backend.model.graph;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Graph<NodeType extends Node, EdgeType extends Edge> {

  private List<NodeType> nodes;
  private List<EdgeType> edges;
}
