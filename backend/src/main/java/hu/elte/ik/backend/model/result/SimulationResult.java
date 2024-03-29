package hu.elte.ik.backend.model.result;

import hu.elte.ik.backend.model.algorithm.AlgorithmType;
import hu.elte.ik.backend.model.graph.GraphType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "results")
public class SimulationResult {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(name = "algorithm_type")
  private AlgorithmType algorithmType;

  @Enumerated(EnumType.STRING)
  @Column(name = "graph_type")
  private GraphType graphType;

  @Column(name = "steps")
  private Integer steps;

  @Column(name = "nodes")
  private Integer nodes;

  @Column(name = "teams")
  private Integer teams;

  @Column(name = "robots")
  private Integer robots;

  @Column(name = "crashes")
  private Integer crashes;

  @Column(name = "faults")
  private Integer faults;

  @Column(name = "probability")
  private Double probability;
}
