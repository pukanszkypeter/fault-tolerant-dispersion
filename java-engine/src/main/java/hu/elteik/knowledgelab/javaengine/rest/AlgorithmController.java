package hu.elteik.knowledgelab.javaengine.rest;

import hu.elteik.knowledgelab.javaengine.rest.dto.GraphStateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/algorithms")
public class AlgorithmController {

    private final AlgorithmService algorithmService;

    @Autowired
    public AlgorithmController(AlgorithmService algorithmService) {
        this.algorithmService = algorithmService;
    }

    @PostMapping("/step")
    public ResponseEntity<GraphStateDTO> step(@RequestBody GraphStateDTO graphStateDTO) {
        return ResponseEntity.ok(algorithmService.step(graphStateDTO));
    }

}
