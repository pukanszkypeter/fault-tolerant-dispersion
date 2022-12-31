package engine.app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import engine.core.models.Edge;
import engine.core.models.Graph;
import engine.core.models.Node;
import engine.core.utils.GraphType;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/java-engine/generator")
public class GraphGeneratorController {

    private final GraphGeneratorService graphGeneratorService;

    public GraphGeneratorController(GraphGeneratorService graphGeneratorService) {
        this.graphGeneratorService = graphGeneratorService;
    }

    @GetMapping("/graph")
    public ResponseEntity<Graph<Node, Edge>> generateGraph(@RequestParam GraphType type, @RequestParam int size) {
        return ResponseEntity.ok(graphGeneratorService.generateGraph(type, size));
    }
    
}
