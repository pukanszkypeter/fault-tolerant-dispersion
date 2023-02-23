package hu.elte.ik.backend.service;

import hu.elte.ik.backend.model.simulation.SimulationResult;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

@Service
@SessionScope
public interface ResultService {
  SimulationResult saveSimulationResult(SimulationResult simulationResult);
}
