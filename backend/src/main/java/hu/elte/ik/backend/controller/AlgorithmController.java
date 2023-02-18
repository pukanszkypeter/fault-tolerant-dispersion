package hu.elte.ik.backend.controller;

import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
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

  @PostMapping("/random-leader")
  public ResponseEntity<Simulation<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot>> randomLeaderDispersion(
    @RequestBody Simulation<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> simulation
  ) {
    return ResponseEntity.ok(
      algorithmService.randomLeaderDispersion(simulation)
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

  @PostMapping("/rotor-router-leader")
  public ResponseEntity<Simulation<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot>> rotorRouterLeaderDispersion(
    @RequestBody Simulation<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> simulation
  ) {
    return ResponseEntity.ok(
      algorithmService.rotorRouterLeaderDispersion(simulation)
    );
  }

  @PostMapping("/faultless-dfs")
  public ResponseEntity<Simulation<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot>> faultlessDfsDispersion(
    @RequestBody Simulation<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> simulation
  ) {
    return ResponseEntity.ok(
      algorithmService.faultlessDfsDispersion(simulation)
    );
  }

  @PostMapping("/faulty-dfs")
  public ResponseEntity<Simulation<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot>> faultyDfsDispersion(
    @RequestBody Simulation<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> simulation
  ) {
    return ResponseEntity.ok(algorithmService.faultyDfsDispersion(simulation));
  }
}
