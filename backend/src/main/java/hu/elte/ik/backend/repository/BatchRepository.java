package hu.elte.ik.backend.repository;

import hu.elte.ik.backend.model.test.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {}
