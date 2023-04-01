package hu.elte.ik.backend.controller;

import hu.elte.ik.backend.model.fault.SimulationFault;
import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.service.AlgorithmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/algorithm")
public class AlgorithmController {

  private final AlgorithmService algorithmService;

  public AlgorithmController(AlgorithmService algorithmService) {
    this.algorithmService = algorithmService;
  }

  @PostMapping("/random")
  public ResponseEntity<Simulation<RandomNode, RandomEdge, RandomRobot>> randomDispersion(
    @RequestBody Simulation<RandomNode, RandomEdge, RandomRobot> simulation
  ) {
    return ResponseEntity.ok(algorithmService.randomDispersion(simulation));
  }

  @PostMapping("/random/fault")
  public ResponseEntity<SimulationFault<RandomNode, RandomEdge, RandomRobot>> randomFaultDispersion(
    @RequestBody SimulationFault<RandomNode, RandomEdge, RandomRobot> simulationFault
  ) {
    return ResponseEntity.ok(
      algorithmService.randomFaultDispersion(simulationFault)
    );
  }

  @PostMapping("/rotor-router")
  public ResponseEntity<Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot>> rotorRouterDispersion(
    @RequestBody Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulation
  ) {
    return ResponseEntity.ok(
      algorithmService.rotorRouterDispersion(simulation)
    );
  }

  @PostMapping("/rotor-router/fault")
  public ResponseEntity<SimulationFault<RotorRouterNode, RotorRouterEdge, RotorRouterRobot>> rotorRouterFaultDispersion(
    @RequestBody SimulationFault<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationFault
  ) {
    return ResponseEntity.ok(
      algorithmService.rotorRouterFaultDispersion(simulationFault)
    );
  }

  @PostMapping("/dfs")
  public ResponseEntity<Simulation<DfsNode, DfsEdge, DfsRobot>> dfsDispersion(
    @RequestBody Simulation<DfsNode, DfsEdge, DfsRobot> simulation
  ) {
    return ResponseEntity.ok(algorithmService.dfsDispersion(simulation));
  }
}
