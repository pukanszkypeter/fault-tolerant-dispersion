package engine.app.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import engine.algorithms.faultless_dfs_dispersion.FaultlessDfsDispersionManagement;
import engine.algorithms.faultless_dfs_dispersion.models.*;
import engine.algorithms.faulty_dfs_dispersion.FaultyDfsDispersionManagement;
import engine.algorithms.faulty_dfs_dispersion.models.*;
import engine.algorithms.random_dispersion.RandomDispersionManagement;
import engine.algorithms.random_dispersion.models.*;
import engine.algorithms.random_with_leader_dispersion.RandomWithLeaderDispersionManagement;
import engine.algorithms.random_with_leader_dispersion.models.*;
import engine.algorithms.rotor_router_dispersion.RotorRouterDispersionManagement;
import engine.algorithms.rotor_router_dispersion.models.*;
import engine.algorithms.rotor_router_with_leader_dispersion.RotorRouterWithLeaderDispersionManagement;
import engine.algorithms.rotor_router_with_leader_dispersion.models.*;
import engine.core.algorithms.*;

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

    @Autowired
    private FaultlessDfsDispersionManagement faultlessDfsDispersionManagement;

    @Autowired
    private FaultyDfsDispersionManagement faultyDfsDispersionManagement;

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

    @Bean
    public FaultlessDfsDispersionManager<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> faultlessDfsDispersionManager() {
        return faultlessDfsDispersionManagement;
    }

    @Bean
    public FaultyDfsDispersionManager<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> faultyDfsDispersionManager() {
        return faultyDfsDispersionManagement;
    }

}
