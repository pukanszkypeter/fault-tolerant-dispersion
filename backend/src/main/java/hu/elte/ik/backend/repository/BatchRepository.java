package hu.elte.ik.backend.repository;

import hu.elte.ik.backend.model.simulation.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {}
