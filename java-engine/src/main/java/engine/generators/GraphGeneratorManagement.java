package engine.generators;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

import org.jgrapht.generate.GraphGenerator;
import org.jgrapht.graph.SimpleGraph;
import org.jgrapht.traverse.DepthFirstIterator;
import org.springframework.stereotype.Component;

import engine.core.generators.GraphGeneratorManager;
import engine.core.models.Edge;
import engine.core.models.Graph;
import engine.core.models.Node;
import engine.core.utils.NodeState;

@Component
public class GraphGeneratorManagement implements GraphGeneratorManager {

    @Override
    public Graph<Node, Edge> generateGraph(GraphGenerator<Long, Long, Long> generator) {

        org.jgrapht.Graph<Long, Long> jGraph = createJGraphObject();

        generator.generateGraph(jGraph);

        return convertJGraphToCoreGraph(jGraph);
    }

    public Graph<Node, Edge> convertJGraphToCoreGraph(org.jgrapht.Graph<Long, Long> jGraph) {

        List<Node> nodeList = new ArrayList<Node>();
        List<Edge> edgeList = new ArrayList<Edge>();

        Iterator<Long> vertexIter = new DepthFirstIterator<>(jGraph);
        while (vertexIter.hasNext()) {
            Long vertex = vertexIter.next();
            nodeList.add(new Node(vertex, NodeState.DEFAULT));

            Iterator<Long> edgeIter = jGraph.edgesOf(vertex).iterator();
            while (edgeIter.hasNext()) {
                Long edge = edgeIter.next();
                
                Optional<Edge> _edge = edgeList.stream().filter(e -> e.getID().equals(edge)).findAny();
                if (_edge.isPresent()) {
                    _edge.get().setToID(vertex);
                } else {
                    edgeList.add(new Edge(edge, vertex, null));
                }
            }
        }

        return new Graph<Node, Edge>(nodeList, edgeList);
    }

    public org.jgrapht.Graph<Long, Long> createJGraphObject() {

        // Create the VertexFactory so the generator can create vertices
        Supplier<Long> vSupplier = new Supplier<Long>()
        {
            private int id = 1;

            @Override
            public Long get()
            {
                return (long) id++;
            }
        };

        // Create the EdgeFactory so the generator can create edges
        Supplier<Long> eSupplier = new Supplier<Long>()
        {
            private int id = 1;

            @Override
            public Long get()
            {
                return (long) id++;
            }
        };

        return new SimpleGraph<>(vSupplier, eSupplier, false);
    }

    /*
    public GraphGenerator<Long, Long, Long> createGraphGenerator(GraphType type, int size) {
        switch (type) {
            case BARABASI_ALBERT_FOREST:
                return new BarabasiAlbertForestGenerator<>(1, size);
            case BARABASI_ALBERT_GRAPH:
                return new BarabasiAlbertGraphGenerator<>(size, size, size);
            case BARBELL:
                return new BarbellGraphGenerator<>(size);
            
            @ Graph as parameter
            case COMPLEMENT:
                return new ComplementGraphGenerator<>(graph);
            
            case COMPLETE_BIPARTITE:
                return new CompleteBipartiteGraphGenerator<>(size, size);
            case COMPLETE:
                return new CompleteGraphGenerator<>(size);
            
            @ Mupltiple Edges not allowed 
            case DIRECTED_SCALE_FREE:
                return new DirectedScaleFreeGraphGenerator<>(0.01f, 0.01f, 0.01f, 0.01f, size, size);
        
            case EMPTY_GRAPH:
                return new EmptyGraphGenerator<>(size);
            
            @ Parameter types infer
            case GENERALIZED_PETERSEN:
                return new GeneralizedPetersenGraphGenerator<>(size, size);
            
            case GNM_RANDOM_BIPARTITE:
                return new GnmRandomBipartiteGraphGenerator<>(size, size, size);
            case GNM_RANDOM:
                return new GnmRandomGraphGenerator<>(size, size, size);
            case GNP_RANDOM_BIPARTITE:
                return new GnpRandomBipartiteGraphGenerator<>(size, size, 0.5);
            case GNP_RANDOM:
                return new GnpRandomGraphGenerator<>(size, 0.5, size);
            case GRID:
                return new GridGraphGenerator<>(size, size);
            case HYPER_CUBE:
                return new HyperCubeGraphGenerator<>(size);
            case KLEINBERG_SMALL_WORLD:
                return new KleinbergSmallWorldGraphGenerator<>(size, size, size, size);
            case LINEAR:
                return new LinearGraphGenerator<>(size);
            case LINEARIZED_CHORD_DIAGRAM:
                return new LinearizedChordDiagramGraphGenerator<>(size, size);
            case LOLLIPOP:
                return new LollipopGraphGenerator<>(size);
            
            @ Plenty options...
            case NAMED:
                return new NamedGraphGenerator();
            
            case PLANTED_PARTITION:
                return new PlantedPartitionGraphGenerator<>(size, size, 0.5, 0.5);
            case PRUFER_TREE:
                return new PruferTreeGenerator<>(size);
            case RANDOM_REGULAR:
                return new RandomRegularGraphGenerator<>(size, size / 2);
            case RING:
                return new RingGraphGenerator<>(size);
            case SCALE_FREE:
                return new ScaleFreeGraphGenerator<>(size);
            
            case SIMPLE_WEIGHTED_BIPARTITE:
                return new SimpleWeightedBipartiteGraphMatrixGenerator<>();
            case SIMPLE_WEIGHTED:
                return new SimpleWeightedGraphMatrixGenerator<>();
             
            case SPECIAL_LINE:
                return new SpecialLineGraphGenerator<>(size);
            case STAR:
                return new StarGraphGenerator<>(size);
            
            case WATTS_STROGATZ:
                return new WattsStrogatzGraphGenerator<>(size, size, 0.5);
            
            case WHEEL:
                return new WheelGraphGenerator<>(size);
            case WINDMILL:
                return new WindmillGraphsGenerator<>(Mode.WINDMILL, size, size);
            default:
                return null;

        }
    }
    */

}