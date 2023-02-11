package hu.elte.ik.backend.module.graph;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

import org.jgrapht.generate.GraphGenerator;
import org.jgrapht.graph.SimpleGraph;
import org.jgrapht.traverse.DepthFirstIterator;

import hu.elte.ik.backend.model.graph.*;
import hu.elte.ik.backend.model.utils.*;

public class GraphServiceHelper {

    public Graph<Node, Edge> generateGraph(GraphGenerator<Long, Long, Long> generator) {

        org.jgrapht.Graph<Long, Long> jGraph = createJGraphObject();

        generator.generateGraph(jGraph);

        return convertJGraphToCoreGraph(jGraph);
    }

    private static Graph<Node, Edge> convertJGraphToCoreGraph(org.jgrapht.Graph<Long, Long> jGraph) {

        List<Node> nodeList = new ArrayList<Node>();
        List<Edge> edgeList = new ArrayList<Edge>();

        Iterator<Long> vertexIter = new DepthFirstIterator<>(jGraph);
        while (vertexIter.hasNext()) {
            Long vertex = vertexIter.next();
            nodeList.add(new Node(vertex, NodeState.DEFAULT));

            Iterator<Long> edgeIter = jGraph.edgesOf(vertex).iterator();
            while (edgeIter.hasNext()) {
                Long edge = edgeIter.next();

                Optional<Edge> _edge = edgeList.stream().filter(e -> e.getId().equals(edge)).findAny();
                if (_edge.isPresent()) {
                    _edge.get().setToId(vertex);
                } else {
                    edgeList.add(new Edge(edge, vertex, null));
                }
            }
        }

        return new Graph<Node, Edge>(nodeList, edgeList);
    }

    private static org.jgrapht.Graph<Long, Long> createJGraphObject() {

        // Create the VertexFactory so the generator can create vertices
        Supplier<Long> vSupplier = new Supplier<Long>() {
            private int id = 1;

            @Override
            public Long get() {
                return (long) id++;
            }
        };

        // Create the EdgeFactory so the generator can create edges
        Supplier<Long> eSupplier = new Supplier<Long>() {
            private int id = 1;

            @Override
            public Long get() {
                return (long) id++;
            }
        };

        return new SimpleGraph<>(vSupplier, eSupplier, false);
    }

}
