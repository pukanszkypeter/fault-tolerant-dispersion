package hu.elte.ik.backend.logic;

import hu.elte.ik.backend.model.simulation.SimulationResult;
import hu.elte.ik.backend.repository.ResultRepository;
import hu.elte.ik.backend.service.ResultService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ResultServiceImpl implements ResultService {

  private final ResultRepository repository;

  @Override
  public SimulationResult saveSimulationResult(
    SimulationResult simulationResult
  ) {
    return repository.save(simulationResult);
  }
}
