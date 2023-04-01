package hu.elte.ik.backend.service;

import hu.elte.ik.backend.model.result.SimulationResult;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

@Service
@SessionScope
public interface ResultService {
  SimulationResult saveSimulationResult(SimulationResult simulationResult);

  List<SimulationResult> getLatestSimulationResults(Long id);
}
