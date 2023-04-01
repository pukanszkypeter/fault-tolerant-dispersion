package hu.elte.ik.backend.controller;

import hu.elte.ik.backend.model.test.Batch;
import hu.elte.ik.backend.model.test.SimulationBatch;
import hu.elte.ik.backend.model.test.SimulationFaultBatch;
import hu.elte.ik.backend.module.algorithm.dfs.*;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
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

  @PostMapping("/random/fault")
  public ResponseEntity<Boolean> testRandomFaultDispersion(
    @RequestBody SimulationFaultBatch<RandomNode, RandomEdge, RandomRobot> simulationFaultBatch
  ) {
    return ResponseEntity.ok(
      service.testRandomFaultDispersion(simulationFaultBatch)
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

  @PostMapping("/rotor-router/fault")
  public ResponseEntity<Boolean> testRotorRouterFaultDispersion(
    @RequestBody SimulationFaultBatch<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulationFaultBatch
  ) {
    return ResponseEntity.ok(
      service.testRotorRouterFaultDispersion(simulationFaultBatch)
    );
  }

  @PostMapping("/dfs")
  public ResponseEntity<Boolean> testDfsDispersion(
    @RequestBody SimulationBatch<DfsNode, DfsEdge, DfsRobot> simulationBatch
  ) {
    return ResponseEntity.ok(service.testDfsDispersion(simulationBatch));
  }
}
