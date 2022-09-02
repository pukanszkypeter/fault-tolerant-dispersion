package hu.elteik.knowledgelab.javaengine.app;

import hu.elteik.knowledgelab.javaengine.algorithms.RandomDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RandomWithLeaderDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RotorRouterDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RotorRouterWithLeaderDispersion;
import hu.elteik.knowledgelab.javaengine.app.dto.AlgorithmType;
import hu.elteik.knowledgelab.javaengine.app.dto.GraphStateDTO;
import hu.elteik.knowledgelab.javaengine.app.dto.RotorRouterDispersionGraphStateDTO;
import hu.elteik.knowledgelab.javaengine.app.dto.RotorRouterWithLeaderDispersionGraphStateDTO;
import hu.elteik.knowledgelab.javaengine.core.models.base.Graph;

import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterdispersion.RotorRouterDispersionGraph;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderGraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;


@Service
@SessionScope
public class AlgorithmService {

    private final RandomDispersion randomDispersion;
    private final RandomWithLeaderDispersion randomWithLeaderDispersion;
    private final RotorRouterDispersion rotorRouterDispersion;
    private final RotorRouterWithLeaderDispersion rotorRouterWithLeaderDispersion;

    @Autowired
    public AlgorithmService(RandomDispersion randomDispersion, 
                            RandomWithLeaderDispersion randomWithLeaderDispersion, 
                            RotorRouterDispersion rotorRouterDispersion, 
                            RotorRouterWithLeaderDispersion rotorRouterWithLeaderDispersion) {
        this.randomDispersion = randomDispersion;
        this.randomWithLeaderDispersion = randomWithLeaderDispersion;
        this.rotorRouterDispersion = rotorRouterDispersion;
        this.rotorRouterWithLeaderDispersion = rotorRouterWithLeaderDispersion;

    }

    public GraphStateDTO randomDispersion(GraphStateDTO graphStateDTO) {
        randomDispersion.step(new Graph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
        return graphStateDTO;
    }

    public GraphStateDTO randomWithLeaderDispersion(GraphStateDTO graphStateDTO) {
        randomWithLeaderDispersion.step(new Graph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
        return graphStateDTO;
    }

    public RotorRouterDispersionGraphStateDTO rotorRouterDispersion(RotorRouterDispersionGraphStateDTO graphStateDTO) {
        rotorRouterDispersion.step(new RotorRouterDispersionGraph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
        return graphStateDTO;
    }

    public RotorRouterWithLeaderDispersionGraphStateDTO rotorRouterWithLeaderDispersion(RotorRouterWithLeaderDispersionGraphStateDTO graphStateDTO) {
        rotorRouterWithLeaderDispersion.step(new RotorRouterWithLeaderGraph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
        return graphStateDTO;
    }


    /*
    public GraphStateDTO step(AlgorithmType type, GraphStateDTO graphStateDTO) {
        switch (type) {

            case RANDOM_DISPERSION:
                randomDispersion.step(new Graph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
                return graphStateDTO;

            case RANDOM_WITH_LEADER_DISPERSION:
                randomWithLeaderDispersion.step(new Graph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
                return graphStateDTO;

            case ROTOR_ROUTER_DISPERSION:
                rotorRouterDispersion.step(new RotorRouterDispersionGraph(RotorRouterDispersionGraphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
                return graphStateDTO;

            case ROTOR_ROUTER_WITH_LEADER_DISPERSION:
                rotorRouterWithLeaderDispersion.step(new RotorRouterWithLeaderGraph(graphStateDTO.getNodes(), graphStateDTO.getEdges()), graphStateDTO.getRobots());
                return graphStateDTO;

            default:
                return graphStateDTO;
        }
    }

     */

}
