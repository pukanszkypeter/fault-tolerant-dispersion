package hu.elte.ik.backend.controller;

import hu.elte.ik.backend.model.simulation.SimulationResult;
import hu.elte.ik.backend.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/result")
public class ResultController {

  private final ResultService service;

  public ResultController(ResultService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<SimulationResult> saveSimulationResult(
    @RequestBody SimulationResult simulationResult
  ) {
    return ResponseEntity.ok(service.saveSimulationResult(simulationResult));
  }
}
