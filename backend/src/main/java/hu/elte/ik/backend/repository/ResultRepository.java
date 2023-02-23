package hu.elte.ik.backend.repository;

import hu.elte.ik.backend.model.simulation.SimulationResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository
  extends JpaRepository<SimulationResult, Long> {}
