package hu.elteik.knowledgelab.javaengine.app;

import hu.elteik.knowledgelab.javaengine.app.dto.RotorRouterDispersionGraphStateDTO;
import hu.elteik.knowledgelab.javaengine.app.dto.RotorRouterWithLeaderDispersionGraphStateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.elteik.knowledgelab.javaengine.app.dto.AlgorithmType;
import hu.elteik.knowledgelab.javaengine.app.dto.GraphStateDTO;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/engine")
public class AlgorithmController {

    private final AlgorithmService algorithmService;

    @Autowired
    public AlgorithmController(AlgorithmService algorithmService) {
        this.algorithmService = algorithmService;
    }

    @PostMapping("/random-dispersion")
    public ResponseEntity<GraphStateDTO> randomDispersionStep(@RequestBody GraphStateDTO graphStateDTO) {
        return ResponseEntity.ok(algorithmService.randomDispersion(graphStateDTO));
    }

    @PostMapping("/random-with-leader-dispersion")
    public ResponseEntity<GraphStateDTO> randomWithLeaderDispersionStep(@RequestBody GraphStateDTO graphStateDTO) {
        return ResponseEntity.ok(algorithmService.randomWithLeaderDispersion(graphStateDTO));
    }

    @PostMapping("/rotor-router-dispersion")
    public ResponseEntity<RotorRouterDispersionGraphStateDTO> rotorRouterDispersionStep(@RequestBody RotorRouterDispersionGraphStateDTO graphStateDTO) {
        return ResponseEntity.ok(algorithmService.rotorRouterDispersion(graphStateDTO));
    }

    @PostMapping("/rotor-router-with-leader-dispersion")
    public ResponseEntity<RotorRouterWithLeaderDispersionGraphStateDTO> rotorRouterWithLeaderDispersionStep(@RequestBody RotorRouterWithLeaderDispersionGraphStateDTO graphStateDTO) {
        return ResponseEntity.ok(algorithmService.rotorRouterWithLeaderDispersion(graphStateDTO));
    }

}
