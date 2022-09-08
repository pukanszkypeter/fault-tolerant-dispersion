package hu.elteik.knowledgelab.javaengine.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.app.dto.SimulationStep;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/algorithm")
public class AlgorithmEngineController {

    private final AlgorithmEngineService algorithmEngineService;

    @Autowired
    public AlgorithmEngineController(AlgorithmEngineService algorithmEngineService) {
        this.algorithmEngineService = algorithmEngineService;
    }

    @PostMapping("/random-dispersion/step")
    public ResponseEntity<SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot>> randomDispersionStep(@RequestBody SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.randomDispersionStep(step));
    }

    @PostMapping("/random-with-leader-dispersion/step")
    public ResponseEntity<SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot>> randomWithLeaderDispersionStep(@RequestBody SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.randomWithLeaderDispersionStep(step));
    }

    @PostMapping("/rotor-router-dispersion/step")
    public ResponseEntity<SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot>> rotorRouterDispersionStep(@RequestBody SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.rotorRouterDispersionStep(step));
    }

    @PostMapping("/rotor-router-with-leader-dispersion/step")
    public ResponseEntity<SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot>> rotorRouterWithLeaderDispersionStep(@RequestBody SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
        return ResponseEntity.ok(algorithmEngineService.rotorRouterWithLeaderDispersionStep(step));
    }

}
