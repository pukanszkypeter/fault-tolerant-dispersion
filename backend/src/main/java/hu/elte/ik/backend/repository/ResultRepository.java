package hu.elte.ik.backend.repository;

import hu.elte.ik.backend.model.simulation.SimulationResult;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResultRepository
  extends JpaRepository<SimulationResult, Long> {
  Optional<SimulationResult> findTopByOrderByIdDesc();

  @Query(value = "SELECT * FROM results WHERE ID > :id", nativeQuery = true)
  List<SimulationResult> findLatestSimulationResultsById(@Param("id") Long id);
}
