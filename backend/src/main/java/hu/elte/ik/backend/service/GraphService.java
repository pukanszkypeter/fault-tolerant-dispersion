package hu.elte.ik.backend.service;

import hu.elte.ik.backend.model.graph.*;
import org.jgrapht.generate.WindmillGraphsGenerator.Mode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

@Service
@SessionScope
public interface GraphService {
  Graph<Node, Edge> barabasiAlbertForest(int tree, int node);

  Graph<Node, Edge> barabasiAlbertGraph(int init, int edge, int node);

  Graph<Node, Edge> barbellGraph(int node);

  Graph<Node, Edge> completeGraph(int node);

  Graph<Node, Edge> gnmRandomGraph(int node, int edge);

  Graph<Node, Edge> gnpRandomGraph(int node, double propability);

  Graph<Node, Edge> gridGraph(int row, int column);

  Graph<Node, Edge> hyperCubeGraph(int dimension);

  Graph<Node, Edge> linearGraph(int size);

  Graph<Node, Edge> lollipopGraph(int size);

  Graph<Node, Edge> ringGraph(int size);

  Graph<Node, Edge> randomRegularGraph(int node, int degree);

  Graph<Node, Edge> starGraph(int order);

  Graph<Node, Edge> wheelGraph(int size);

  Graph<Node, Edge> windmillGraph(Mode mode, int copies, int size);
}
