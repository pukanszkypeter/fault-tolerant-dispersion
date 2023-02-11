package hu.elte.ik.backend.logic;

import org.jgrapht.generate.WindmillGraphsGenerator.Mode;
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

import hu.elte.ik.backend.service.GraphService;
import lombok.AllArgsConstructor;
import hu.elte.ik.backend.module.graph.GraphServiceHelper;
import hu.elte.ik.backend.module.graph.generator.BarbellGraphGenerator;
import hu.elte.ik.backend.module.graph.generator.LollipopGraphGenerator;
import hu.elte.ik.backend.model.graph.*;

@AllArgsConstructor
public class GraphServiceImpl implements GraphService {

    private final GraphServiceHelper helper;

    @Override
    public Graph<Node, Edge> barabasiAlbertForest(int tree, int node) {
        return helper.generateGraph(new BarabasiAlbertForestGenerator<>(tree, node));
    }

    @Override
    public Graph<Node, Edge> barabasiAlbertGraph(int init, int edge, int node) {
        return helper.generateGraph(new BarabasiAlbertGraphGenerator<>(init, edge, node));
    }

    @Override
    public Graph<Node, Edge> barbellGraph(int node) {
        return helper.generateGraph(new BarbellGraphGenerator<>(node));
    }

    @Override
    public Graph<Node, Edge> completeGraph(int node) {
        return helper.generateGraph(new CompleteGraphGenerator<>(node));
    }

    @Override
    public Graph<Node, Edge> gnmRandomGraph(int node, int edge) {
        return helper.generateGraph(new GnmRandomGraphGenerator<>(node, edge));
    }

    @Override
    public Graph<Node, Edge> gnpRandomGraph(int node, double propability) {
        return helper.generateGraph(new GnpRandomGraphGenerator<>(node, propability));
    }

    @Override
    public Graph<Node, Edge> gridGraph(int row, int column) {
        return helper.generateGraph(new GridGraphGenerator<>(row, column));
    }

    @Override
    public Graph<Node, Edge> hyperCubeGraph(int dimension) {
        return helper.generateGraph(new HyperCubeGraphGenerator<>(dimension));
    }

    @Override
    public Graph<Node, Edge> linearGraph(int size) {
        return helper.generateGraph(new LinearGraphGenerator<>(size));
    }

    @Override
    public Graph<Node, Edge> lollipopGraph(int size) {
        return helper.generateGraph(new LollipopGraphGenerator<>(size));
    }

    @Override
    public Graph<Node, Edge> ringGraph(int size) {
        return helper.generateGraph(new RingGraphGenerator<>(size));
    }

    @Override
    public Graph<Node, Edge> randomRegularGraph(int node, int degree) {
        return helper.generateGraph(new RandomRegularGraphGenerator<>(node, degree));
    }

    @Override
    public Graph<Node, Edge> starGraph(int order) {
        return helper.generateGraph(new StarGraphGenerator<>(order));
    }

    @Override
    public Graph<Node, Edge> wheelGraph(int size) {
        return helper.generateGraph(new WheelGraphGenerator<>(size));
    }

    @Override
    public Graph<Node, Edge> windmillGraph(Mode mode, int copies, int size) {
        return helper.generateGraph(new WindmillGraphsGenerator<>(mode, copies, size));
    }

}
