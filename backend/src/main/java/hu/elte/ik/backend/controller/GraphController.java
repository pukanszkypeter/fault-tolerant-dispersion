package hu.elte.ik.backend.controller;

import hu.elte.ik.backend.model.graph.*;
import hu.elte.ik.backend.service.GraphService;
import org.jgrapht.generate.WindmillGraphsGenerator.Mode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/graph")
public class GraphController {

  private final GraphService graphService;

  public GraphController(GraphService graphService) {
    this.graphService = graphService;
  }

  @GetMapping("/barabasi-albert-forest")
  public ResponseEntity<Graph<Node, Edge>> barabasiAlbertForest(
    @RequestParam int tree,
    @RequestParam int node
  ) {
    return ResponseEntity.ok(graphService.barabasiAlbertForest(tree, node));
  }

  @GetMapping("/barabasi-albert-graph")
  public ResponseEntity<Graph<Node, Edge>> barabasiAlbertGraph(
    @RequestParam int init,
    @RequestParam int edge,
    @RequestParam int node
  ) {
    return ResponseEntity.ok(
      graphService.barabasiAlbertGraph(init, edge, node)
    );
  }

  @GetMapping("/barbell")
  public ResponseEntity<Graph<Node, Edge>> barbellGraph(
    @RequestParam int node
  ) {
    return ResponseEntity.ok(graphService.barbellGraph(node));
  }

  @GetMapping("/complete")
  public ResponseEntity<Graph<Node, Edge>> completeGraph(
    @RequestParam int node
  ) {
    return ResponseEntity.ok(graphService.completeGraph(node));
  }

  @GetMapping("/gnm-random")
  public ResponseEntity<Graph<Node, Edge>> gnmRandomGraph(
    @RequestParam int node,
    @RequestParam int edge
  ) {
    return ResponseEntity.ok(graphService.gnmRandomGraph(node, edge));
  }

  @GetMapping("/gnp-random")
  public ResponseEntity<Graph<Node, Edge>> gnpRandomGraph(
    @RequestParam int node,
    @RequestParam double probability
  ) {
    return ResponseEntity.ok(graphService.gnpRandomGraph(node, probability));
  }

  @GetMapping("/grid")
  public ResponseEntity<Graph<Node, Edge>> gridGraph(
    @RequestParam int row,
    @RequestParam int column
  ) {
    return ResponseEntity.ok(graphService.gridGraph(row, column));
  }

  @GetMapping("/hyper-cube")
  public ResponseEntity<Graph<Node, Edge>> hyperCubeGraph(
    @RequestParam int dimension
  ) {
    return ResponseEntity.ok(graphService.hyperCubeGraph(dimension));
  }

  @GetMapping("/linear")
  public ResponseEntity<Graph<Node, Edge>> linearGraph(@RequestParam int size) {
    return ResponseEntity.ok(graphService.linearGraph(size));
  }

  @GetMapping("/lollipop")
  public ResponseEntity<Graph<Node, Edge>> lollipopGraph(
    @RequestParam int size
  ) {
    return ResponseEntity.ok(graphService.lollipopGraph(size));
  }

  @GetMapping("/ring")
  public ResponseEntity<Graph<Node, Edge>> ringGraph(@RequestParam int size) {
    return ResponseEntity.ok(graphService.ringGraph(size));
  }

  @GetMapping("/random-regular")
  public ResponseEntity<Graph<Node, Edge>> randomRegularGraph(
    @RequestParam int node,
    @RequestParam int degree
  ) {
    return ResponseEntity.ok(graphService.randomRegularGraph(node, degree));
  }

  @GetMapping("/star")
  public ResponseEntity<Graph<Node, Edge>> starGraph(@RequestParam int order) {
    return ResponseEntity.ok(graphService.starGraph(order));
  }

  @GetMapping("/wheel")
  public ResponseEntity<Graph<Node, Edge>> wheelGraph(@RequestParam int size) {
    return ResponseEntity.ok(graphService.wheelGraph(size));
  }

  @GetMapping("/windmill")
  public ResponseEntity<Graph<Node, Edge>> windmillGraph(
    @RequestParam String mode,
    @RequestParam int copies,
    @RequestParam int size
  ) {
    return ResponseEntity.ok(
      graphService.windmillGraph(Mode.valueOf(mode), copies, size)
    );
  }
}
