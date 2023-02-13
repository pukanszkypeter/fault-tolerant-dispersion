package hu.elte.ik.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;

@Service
@SessionScope
public interface AlgorithmService {

    Simulation<RandomNode, RandomEdge, RandomRobot> randomDispersion(
            Simulation<RandomNode, RandomEdge, RandomRobot> simulation);

    Simulation<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> randomLeaderDispersion(
            Simulation<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> simulation);

    Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> rotorRouterDispersion(
            Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulation);

    Simulation<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> rotorRouterLeaderDispersion(
            Simulation<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> simulation);

    Simulation<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> faultlessDfsDispersion(
            Simulation<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> simulation);

    Simulation<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> faultyDfsDispersion(
            Simulation<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> simulation);

}
