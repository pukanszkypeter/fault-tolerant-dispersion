package engine.app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import engine.algorithms.faultless_dfs_dispersion.models.*;
import engine.algorithms.faulty_dfs_dispersion.models.*;
import engine.algorithms.random_dispersion.models.*;
import engine.algorithms.random_with_leader_dispersion.models.*;
import engine.algorithms.rotor_router_dispersion.models.*;
import engine.algorithms.rotor_router_with_leader_dispersion.models.*;
import engine.app.dto.SimulationStep;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/java-engine/algorithm")
public class AlgorithmEngineController {

    private final AlgorithmEngineService algorithmEngineService;

    public AlgorithmEngineController(AlgorithmEngineService algorithmEngineService) {
        this.algorithmEngineService = algorithmEngineService;
    }

    @PostMapping("/random-dispersion/step")
    public ResponseEntity<SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot>> randomDispersionStep(
            @RequestBody SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.randomDispersionStep(step));
    }

    @PostMapping("/random-dispersion/test")
    public ResponseEntity<Long> randomDispersionTest(
            @RequestBody SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.randomDispersionTest(step));
    }

    @PostMapping("/random-with-leader-dispersion/step")
    public ResponseEntity<SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot>> randomWithLeaderDispersionStep(
            @RequestBody SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.randomWithLeaderDispersionStep(step));
    }

    @PostMapping("/random-with-leader-dispersion/test")
    public ResponseEntity<Long> randomWithLeaderDispersionTest(
            @RequestBody SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.randomWithLeaderDispersionTest(step));
    }

    @PostMapping("/rotor-router-dispersion/step")
    public ResponseEntity<SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot>> rotorRouterDispersionStep(
            @RequestBody SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.rotorRouterDispersionStep(step));
    }

    @PostMapping("/rotor-router-dispersion/test")
    public ResponseEntity<Long> rotorRouterDispersionTest(
            @RequestBody SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.rotorRouterDispersionTest(step));
    }

    @PostMapping("/rotor-router-with-leader-dispersion/step")
    public ResponseEntity<SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot>> rotorRouterWithLeaderDispersionStep(
            @RequestBody SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.rotorRouterWithLeaderDispersionStep(step));
    }

    @PostMapping("/rotor-router-with-leader-dispersion/test")
    public ResponseEntity<Long> rotorRouterWithLeaderDispersionTest(
            @RequestBody SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.rotorRouterWithLeaderDispersionTest(step));
    }

    @PostMapping("/faultless-dfs-dispersion/step")
    public ResponseEntity<SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot>> faultlessDfsDispersionStep(
            @RequestBody SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.faultlessDfsDispersionStep(step));
    }

    @PostMapping("/faultless-dfs-dispersion/test")
    public ResponseEntity<Long> faultlessDfsDispersionTest(
            @RequestBody SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.faultlessDfsDispersionTest(step));
    }

    @PostMapping("/faulty-dfs-dispersion/step")
    public ResponseEntity<SimulationStep<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot>> faultyDfsDispersionStep(
            @RequestBody SimulationStep<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.faultyDfsDispersionStep(step));
    }

    @PostMapping("/faulty-dfs-dispersion/test")
    public ResponseEntity<Long> faultyDfsDispersionTest(
            @RequestBody SimulationStep<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.faultyDfsDispersionTest(step));
    }

}
