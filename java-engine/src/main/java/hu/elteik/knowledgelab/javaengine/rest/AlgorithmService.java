package hu.elteik.knowledgelab.javaengine.rest;

import hu.elteik.knowledgelab.javaengine.algorithms.RandomDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RandomWithLeaderDispersion;
import hu.elteik.knowledgelab.javaengine.rest.dto.AlgorithmType;
import hu.elteik.knowledgelab.javaengine.rest.dto.GraphStateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;


@Service
@SessionScope
public class AlgorithmService {

    private final RandomDispersion randomDispersion;
    private final RandomWithLeaderDispersion randomWithLeaderDispersion;

    @Autowired
    public AlgorithmService(RandomDispersion randomDispersion, RandomWithLeaderDispersion randomWithLeaderDispersion) {
        this.randomDispersion = randomDispersion;
        this.randomWithLeaderDispersion = randomWithLeaderDispersion;

    }

    public GraphStateDTO step(GraphStateDTO graphStateDTO) {
        switch (graphStateDTO.getAlgorithmType()) {
            case RANDOM_DISPERSION:
                randomDispersion.step(graphStateDTO.getGraph(), graphStateDTO.getRobotList());
                return graphStateDTO;

            case RANDOM_WITH_LEADER_DISPERSION:
                randomWithLeaderDispersion.step(graphStateDTO.getGraph(), graphStateDTO.getRobotList());
                return graphStateDTO;

            default:
                return graphStateDTO;
        }
    }

}
