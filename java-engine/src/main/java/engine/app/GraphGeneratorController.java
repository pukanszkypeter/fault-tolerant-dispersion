package engine.app;

import org.jgrapht.generate.BarabasiAlbertForestGenerator;
import org.jgrapht.generate.BarabasiAlbertGraphGenerator;
import org.jgrapht.generate.CompleteGraphGenerator;
import org.jgrapht.generate.GnmRandomGraphGenerator;
import org.jgrapht.generate.GnpRandomGraphGenerator;
import org.jgrapht.generate.GridGraphGenerator;
import org.jgrapht.generate.HyperCubeGraphGenerator;
import org.jgrapht.generate.LinearGraphGenerator;
import org.jgrapht.generate.RandomRegularGraphGenerator;
import org.jgrapht.generate.RingGraphGenerator;
import org.jgrapht.generate.StarGraphGenerator;
import org.jgrapht.generate.WheelGraphGenerator;
import org.jgrapht.generate.WindmillGraphsGenerator;
import org.jgrapht.generate.WindmillGraphsGenerator.Mode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import engine.core.models.Edge;
import engine.core.models.Graph;
import engine.core.models.Node;
import engine.generators.others.BarbellGraphGenerator;
import engine.generators.others.LollipopGraphGenerator;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/java-engine/graph-generator")
public class GraphGeneratorController {

    private final GraphGeneratorService graphGeneratorService;

    public GraphGeneratorController(GraphGeneratorService graphGeneratorService) {
        this.graphGeneratorService = graphGeneratorService;
    }

    @GetMapping("/barabasi-albert-forest")
    public ResponseEntity<Graph<Node, Edge>> generateBarabasiAlbertForest(
        @RequestParam int tree, 
        @RequestParam int node
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new BarabasiAlbertForestGenerator<>(tree, node)
            )
        );
    }
    
    @GetMapping("/barabasi-albert-graph")
    public ResponseEntity<Graph<Node, Edge>> generateBarabasiAlbertGraph(
        @RequestParam int init, 
        @RequestParam int edge,
        @RequestParam int node
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new BarabasiAlbertGraphGenerator<>(init, edge, node)
            )
        );
    }

    @GetMapping("/barbell")
    public ResponseEntity<Graph<Node, Edge>> generateBarbellGraph(
        @RequestParam int node
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new BarbellGraphGenerator<>(node)
            )
        );
    }

    @GetMapping("/complete")
    public ResponseEntity<Graph<Node, Edge>> generateCompleteGraph(
        @RequestParam int node
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new CompleteGraphGenerator<>(node)
            )
        );
    }

    @GetMapping("/gnm-random")
    public ResponseEntity<Graph<Node, Edge>> generateGnmRandomGraph(
        @RequestParam int node,
        @RequestParam int edge
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new GnmRandomGraphGenerator<>(node, node)
            )
        );
    }

    @GetMapping("/gnp-random")
    public ResponseEntity<Graph<Node, Edge>> generateGnpRandomGraph(
        @RequestParam int node,
        @RequestParam double propability
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new GnpRandomGraphGenerator<>(node, propability)
            )
        );
    }

    @GetMapping("/grid")
    public ResponseEntity<Graph<Node, Edge>> generateGridGraph(
        @RequestParam int row,
        @RequestParam int column
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new GridGraphGenerator<>(row, column)
            )
        );
    }

    @GetMapping("/hyper-cube")
    public ResponseEntity<Graph<Node, Edge>> generateHyperCubeGraph(
        @RequestParam int dimension
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new HyperCubeGraphGenerator<>(dimension)
            )
        );
    }

    @GetMapping("/linear")
    public ResponseEntity<Graph<Node, Edge>> generateLinearGraph(
        @RequestParam int size
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new LinearGraphGenerator<>(size)
            )
        );
    }

    @GetMapping("/lollipop")
    public ResponseEntity<Graph<Node, Edge>> generateLollipopGraph(
        @RequestParam int size
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new LollipopGraphGenerator<>(size)
            )
        );
    }

    @GetMapping("/ring")
    public ResponseEntity<Graph<Node, Edge>> generateGridGraph(
        @RequestParam int size
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new RingGraphGenerator<>(size)
            )
        );
    }

    @GetMapping("/random-regular")
    public ResponseEntity<Graph<Node, Edge>> generateRandomRegularGraph(
        @RequestParam int node,
        @RequestParam int degree
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new RandomRegularGraphGenerator<>(node, degree)
            )
        );
    }

    @GetMapping("/star")
    public ResponseEntity<Graph<Node, Edge>> generateStarGraph(
        @RequestParam int order
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new StarGraphGenerator<>(order)
            )
        );
    }

    @GetMapping("/wheel")
    public ResponseEntity<Graph<Node, Edge>> generateWheelGraph(
        @RequestParam int size
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new WheelGraphGenerator<>(size)
            )
        );
    }

    @GetMapping("/windmill")
    public ResponseEntity<Graph<Node, Edge>> generateWindmillGraph(
        @RequestParam String mode,
        @RequestParam int copies,
        @RequestParam int size
    ) {
        return ResponseEntity.ok(
            graphGeneratorService.generateGraph(
                new WindmillGraphsGenerator<>(Mode.valueOf(mode), copies, size)
            )
        );
    }
    

}
