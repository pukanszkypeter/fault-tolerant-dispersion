package engine.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.ApplicationScope;

import engine.algorithms.faultless_dfs_dispersion.models.*;
import engine.algorithms.faulty_dfs_dispersion.models.*;
import engine.algorithms.random_dispersion.models.*;
import engine.algorithms.random_with_leader_dispersion.models.*;
import engine.algorithms.rotor_router_dispersion.models.*;
import engine.algorithms.rotor_router_with_leader_dispersion.models.*;
import engine.app.dto.*;
import engine.core.algorithms.*;
import engine.core.models.Node;
import engine.core.models.Robot;
import engine.core.utils.NodeState;
import engine.core.utils.RobotState;

@Service
@ApplicationScope
public class AlgorithmEngineService {

    private final RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionManager;
    private final RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionManager;
    private final RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionManager;
    private final RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionManager;
    private final FaultlessDfsDispersionManager<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> faultlessDfsDispersionManager;
    private final FaultyDfsDispersionManager<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> faultyDfsDispersionManager;

    @Autowired
    public AlgorithmEngineService(
            RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionManager,
            RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionManager,
            RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionManager,
            RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionManager,
            FaultlessDfsDispersionManager<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> faultlessDfsDispersionManager,
            FaultyDfsDispersionManager<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> faultyDfsDispersionManager) {
        this.randomDispersionManager = randomDispersionManager;
        this.randomWithLeaderDispersionManager = randomWithLeaderDispersionManager;
        this.rotorRouterDispersionManager = rotorRouterDispersionManager;
        this.rotorRouterWithLeaderDispersionManager = rotorRouterWithLeaderDispersionManager;
        this.faultlessDfsDispersionManager = faultlessDfsDispersionManager;
        this.faultyDfsDispersionManager = faultyDfsDispersionManager;
    }

    public SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionStep(
            SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.RANDOM_DISPERSION)) {

            if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                step.setSimulationState(SimulationState.IN_PROGRESS);
            }

            randomDispersionManager.step(step.getGraph(), step.getRobotList());
            step.setStep(step.getStep() + 1);

            if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                step.setSimulationState(SimulationState.FINISHED);
            }

            return step;
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public Long randomDispersionTest(
            SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.RANDOM_DISPERSION)) {
            try {
                while (!step.getSimulationState().equals(SimulationState.FINISHED)) {
                    if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                        step.setSimulationState(SimulationState.IN_PROGRESS);
                    }

                    randomDispersionManager.step(step.getGraph(), step.getRobotList());
                    step.setStep(step.getStep() + 1);

                    if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                        step.setSimulationState(SimulationState.FINISHED);
                    }
                }
                return step.getStep();
            } catch (Exception e) {
                return null;
            }
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionStep(
            SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.RANDOM_WITH_LEADER_DISPERSION)) {

            if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                step.setSimulationState(SimulationState.IN_PROGRESS);
            }

            randomWithLeaderDispersionManager.step(step.getGraph(), step.getRobotList());
            step.setStep(step.getStep() + 1);

            if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                step.setSimulationState(SimulationState.FINISHED);
            }

            return step;
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public Long randomWithLeaderDispersionTest(
            SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.RANDOM_WITH_LEADER_DISPERSION)) {
            try {
                while (!step.getSimulationState().equals(SimulationState.FINISHED)) {
                    if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                        step.setSimulationState(SimulationState.IN_PROGRESS);
                    }

                    randomWithLeaderDispersionManager.step(step.getGraph(), step.getRobotList());
                    step.setStep(step.getStep() + 1);

                    if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                        step.setSimulationState(SimulationState.FINISHED);
                    }
                }
                return step.getStep();
            } catch (Exception e) {
                return null;
            }
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionStep(
            SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.ROTOR_ROUTER_DISPERSION)) {

            if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                step.setSimulationState(SimulationState.IN_PROGRESS);
            }

            rotorRouterDispersionManager.step(step.getGraph(), step.getRobotList());
            step.setStep(step.getStep() + 1);

            if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                step.setSimulationState(SimulationState.FINISHED);
            }

            return step;
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public Long rotorRouterDispersionTest(
            SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.ROTOR_ROUTER_DISPERSION)) {
            try {
                while (!step.getSimulationState().equals(SimulationState.FINISHED)) {
                    if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                        step.setSimulationState(SimulationState.IN_PROGRESS);
                    }

                    rotorRouterDispersionManager.step(step.getGraph(), step.getRobotList());
                    step.setStep(step.getStep() + 1);

                    if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                        step.setSimulationState(SimulationState.FINISHED);
                    }
                }
                return step.getStep();
            } catch (Exception e) {
                return null;
            }
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionStep(
            SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION)) {

            if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                step.setSimulationState(SimulationState.IN_PROGRESS);
            }

            rotorRouterWithLeaderDispersionManager.step(step.getGraph(), step.getRobotList());
            step.setStep(step.getStep() + 1);

            if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                step.setSimulationState(SimulationState.FINISHED);
            }

            return step;
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public Long rotorRouterWithLeaderDispersionTest(
            SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION)) {
            try {
                while (!step.getSimulationState().equals(SimulationState.FINISHED)) {
                    if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                        step.setSimulationState(SimulationState.IN_PROGRESS);
                    }

                    rotorRouterWithLeaderDispersionManager.step(step.getGraph(), step.getRobotList());
                    step.setStep(step.getStep() + 1);

                    if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                        step.setSimulationState(SimulationState.FINISHED);
                    }
                }
                return step.getStep();
            } catch (Exception e) {
                return null;
            }
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> faultlessDfsDispersionStep(
        SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.FAULTLESS_DFS_DISPERSION)) {

            if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                step.setSimulationState(SimulationState.IN_PROGRESS);
            }

            if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                step.setSimulationState(SimulationState.FINISHED);
            } else {
                faultlessDfsDispersionManager.step(step.getGraph(), step.getRobotList());
                step.setStep(step.getStep() + 1);
            }

            return step;
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public Long faultlessDfsDispersionTest(
            SimulationStep<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.FAULTLESS_DFS_DISPERSION)) {
            try {
                while (!step.getSimulationState().equals(SimulationState.FINISHED)) {
                    if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                        step.setSimulationState(SimulationState.IN_PROGRESS);
                    }

                    if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                        step.setSimulationState(SimulationState.FINISHED);
                    } else {
                        faultlessDfsDispersionManager.step(step.getGraph(), step.getRobotList());
                        step.setStep(step.getStep() + 1);
                    }

                }
                return step.getStep();
            } catch (Exception e) {
                return null;
            }
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public SimulationStep<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> faultyDfsDispersionStep(
        SimulationStep<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.FAULTY_DFS_DISPERSION)) {

            if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                step.setSimulationState(SimulationState.IN_PROGRESS);
            }

            if (areRobotsFinished(step.getRobotList())) {
                step.setSimulationState(SimulationState.FINISHED);
            } else {
                faultyDfsDispersionManager.step(step.getGraph(), step.getRobotList());
                step.setStep(step.getStep() + 1);
            }

            return step;
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    public Long faultyDfsDispersionTest(
            SimulationStep<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> step) {
        if (step.getAlgorithmType().equals(AlgorithmType.FAULTLESS_DFS_DISPERSION)) {
            try {
                while (!step.getSimulationState().equals(SimulationState.FINISHED)) {
                    if (step.getSimulationState().equals(SimulationState.DEFAULT)) {
                        step.setSimulationState(SimulationState.IN_PROGRESS);
                    }

                    if (isDispersionReached(step.getGraph().getNodeList()) && areRobotsFinished(step.getRobotList())) {
                        step.setSimulationState(SimulationState.FINISHED);
                    } else {
                        faultyDfsDispersionManager.step(step.getGraph(), step.getRobotList());
                        step.setStep(step.getStep() + 1);
                    }

                }
                return step.getStep();
            } catch (Exception e) {
                return null;
            }
        } else {
            throw new RuntimeException("Wrong algorithm type defined.");
        }
    }

    private static boolean isDispersionReached(List<? extends Node> nodeList) {
        return nodeList.stream().filter(node -> node.getState().equals(NodeState.OCCUPIED)).count() == nodeList.size();
    }

    private static boolean areRobotsFinished(List<? extends Robot> robotList) {
        return robotList.stream().filter(
                robot -> robot.getState().equals(RobotState.SETTLED) || robot.getState().equals(RobotState.TERMINATED) || robot.getState().equals(RobotState.CRASHED))
                .count() == robotList.size();
    }

}
