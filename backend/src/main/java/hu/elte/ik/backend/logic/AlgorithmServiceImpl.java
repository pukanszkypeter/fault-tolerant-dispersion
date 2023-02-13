package hu.elte.ik.backend.logic;

import java.util.List;

import hu.elte.ik.backend.model.simulation.Simulation;
import hu.elte.ik.backend.model.utils.NodeState;
import hu.elte.ik.backend.model.utils.RobotState;
import hu.elte.ik.backend.model.utils.SimulationState;
import hu.elte.ik.backend.module.algorithm.FaultlessDfsHelper;
import hu.elte.ik.backend.module.algorithm.FaultyDfsHelper;
import hu.elte.ik.backend.module.algorithm.RandomHelper;
import hu.elte.ik.backend.module.algorithm.RandomLeaderHelper;
import hu.elte.ik.backend.module.algorithm.RotorRouterHelper;
import hu.elte.ik.backend.module.algorithm.RotorRouterLeaderHelper;
import hu.elte.ik.backend.service.AlgorithmService;
import lombok.AllArgsConstructor;

import hu.elte.ik.backend.model.graph.Node;
import hu.elte.ik.backend.model.algorithm.Robot;
import hu.elte.ik.backend.module.algorithm.random.*;
import hu.elte.ik.backend.module.algorithm.random_leader.*;
import hu.elte.ik.backend.module.algorithm.rotor_router.*;
import hu.elte.ik.backend.module.algorithm.rotor_router_leader.*;
import hu.elte.ik.backend.module.algorithm.utils.Stepper;
import hu.elte.ik.backend.module.algorithm.faultless_dfs.*;
import hu.elte.ik.backend.module.algorithm.faulty_dfs.*;

@SuppressWarnings({ "rawtypes", "unchecked" })
@AllArgsConstructor
public class AlgorithmServiceImpl implements AlgorithmService {

    private final RandomHelper randomHelper;
    private final RandomLeaderHelper randomLeaderHelper;
    private final RotorRouterHelper rotorRouterHelper;
    private final RotorRouterLeaderHelper rotorRouterLeaderHelper;
    private final FaultlessDfsHelper faultlessDfsHelper;
    private final FaultyDfsHelper faultyDfsHelper;

    @Override
    public Simulation<RandomNode, RandomEdge, RandomRobot> randomDispersion(
            Simulation<RandomNode, RandomEdge, RandomRobot> simulation) {
        return step(randomHelper, simulation);
    }

    @Override
    public Simulation<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> randomLeaderDispersion(
            Simulation<RandomLeaderNode, RandomLeaderEdge, RandomLeaderRobot> simulation) {
        return step(randomLeaderHelper, simulation);
    }

    @Override
    public Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> rotorRouterDispersion(
            Simulation<RotorRouterNode, RotorRouterEdge, RotorRouterRobot> simulation) {
        return step(rotorRouterHelper, simulation);
    }

    @Override
    public Simulation<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> rotorRouterLeaderDispersion(
            Simulation<RotorRouterLeaderNode, RotorRouterLeaderEdge, RotorRouterLeaderRobot> simulation) {
        return step(rotorRouterLeaderHelper, simulation);
    }

    @Override
    public Simulation<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> faultlessDfsDispersion(
            Simulation<FaultlessDfsNode, FaultlessDfsEdge, FaultlessDfsRobot> simulation) {
        return step(faultlessDfsHelper, simulation);
    }

    @Override
    public Simulation<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> faultyDfsDispersion(
            Simulation<FaultyDfsNode, FaultyDfsEdge, FaultyDfsRobot> simulation) {
        return step(faultyDfsHelper, simulation);
    }

    private static Simulation step(Stepper stepper, Simulation simulation) {

        if (simulation.getState().equals(SimulationState.DEFAULT)) {
            simulation.setState(SimulationState.IN_PROGRESS);
        }

        stepper.step(simulation.getGraph(), simulation.getRobots());
        simulation.setStep(simulation.getStep() + 1);

        if (isFinished(simulation)) {
            simulation.setState(SimulationState.FINISHED);
        }

        return simulation;
    }

    private static boolean isFinished(Simulation simulation) {
        boolean graphFinished = simulation.getGraph().getNodes().stream()
                .filter(node -> ((Node) node).getState().equals(NodeState.OCCUPIED))
                .count() == simulation.getGraph().getNodes().size();
        boolean robotsFinished = simulation.getRobots().stream().filter(
                robot -> List.of(RobotState.TERMINATED, RobotState.CRASHED)
                        .contains(((Robot) robot).getState()))
                .count() == simulation.getRobots().size();
        return graphFinished || robotsFinished;
    }

}
