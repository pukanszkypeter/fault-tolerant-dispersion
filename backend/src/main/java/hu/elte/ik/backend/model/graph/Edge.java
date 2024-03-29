package hu.elte.ik.backend.model.graph;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Edge {

  private Long id;
  private Long fromId;
  private Long toId;

  public Edge(Edge that) {
    this(that.getId(), that.getFromId(), that.getToId());
  }
}
