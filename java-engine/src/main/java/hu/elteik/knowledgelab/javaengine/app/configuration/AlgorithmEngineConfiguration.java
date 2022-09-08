package hu.elteik.knowledgelab.javaengine.app.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion.RandomDispersionManagement;
import hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion.RandomWithLeaderDispersionManagement;
import hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.RotorRouterDispersionManagement;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_with_leader_dispersion.RotorRouterWithLeaderDispersionManagement;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RandomDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RandomWithLeaderDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RotorRouterDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RotorRouterWithLeaderDispersionManager;

@Configuration
public class AlgorithmEngineConfiguration {

    @Autowired
    private RandomDispersionManagement randomDispersionManagement;

    @Autowired
    private RandomWithLeaderDispersionManagement randomWithLeaderDispersionManagement;

    @Autowired
    private RotorRouterDispersionManagement rotorRouterDispersionManagement;

    @Autowired
    private RotorRouterWithLeaderDispersionManagement rotorRouterWithLeaderDispersionManagement;
    
    @Bean
    public RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionManager() {
        return randomDispersionManagement;
    }

    @Bean
    public RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionManager() {
        return randomWithLeaderDispersionManagement;
    }

    @Bean
    public RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionManager() {
        return rotorRouterDispersionManagement;
    }

    @Bean
    public RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionManager() {
        return rotorRouterWithLeaderDispersionManagement;
    }
    
}
