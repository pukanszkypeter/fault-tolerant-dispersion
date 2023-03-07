package hu.elte.ik.backend.controller;

import hu.elte.ik.backend.model.simulation.Batch;
import hu.elte.ik.backend.model.simulation.SimulationBatch;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
import hu.elte.ik.backend.service.TestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

  private final TestService service;

  public TestController(TestService service) {
    this.service = service;
  }

  @GetMapping("/batch/{numOfTests}")
  public ResponseEntity<Batch> saveBatch(
    @PathVariable("numOfTests") Integer numOfTests
  ) {
    return ResponseEntity.ok(service.saveBatch(numOfTests));
  }

  @PostMapping("/random")
  public ResponseEntity<Boolean> testRandomDispersion(
    @RequestBody SimulationBatch<RandomNode, RandomEdge, RandomRobot> simulationBatch
  ) {
    return ResponseEntity.ok(service.testRandomDispersion(simulationBatch));
  }

  @PostMapping("/random-leader")
  public ResponseEntity<Boolean> testRandomLeaderDispersion(
    @RequestBody SimulationBatch<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> simulationBatch
  ) {
    return ResponseEntity.ok(
      service.testRandomLeaderDispersion(simulationBatch)
    );
  }

  @PostMapping("/rotor-router")
  public ResponseEntity<Boolean> testRotorRouterDispersion(
    @RequestBody SimulationBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationBatch
  ) {
    return ResponseEntity.ok(
      service.testRotorRouterDispersion(simulationBatch)
    );
  }

  @PostMapping("/rotor-router-leader")
  public ResponseEntity<Boolean> testRotorRouterLeaderDispersion(
    @RequestBody SimulationBatch<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> simulationBatch
  ) {
    return ResponseEntity.ok(
      service.testRotorRouterLeaderDispersion(simulationBatch)
    );
  }

  @PostMapping("/faultless-dfs")
  public ResponseEntity<Boolean> testFaultlessDfsDispersion(
    @RequestBody SimulationBatch<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> simulationBatch
  ) {
    return ResponseEntity.ok(
      service.testFaultlessDfsDispersion(simulationBatch)
    );
  }

  @PostMapping("/faulty-dfs")
  public ResponseEntity<Boolean> testFaultyDfsDispersion(
    @RequestBody SimulationBatch<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> simulationBatch
  ) {
    return ResponseEntity.ok(service.testFaultyDfsDispersion(simulationBatch));
  }
}
