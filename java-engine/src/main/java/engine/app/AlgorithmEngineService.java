package engine.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.ApplicationScope;

import engine.algorithms.random_dispersion.models.*;
import engine.algorithms.random_with_leader_dispersion.models.*;
import engine.algorithms.rotor_router_dispersion.models.*;
import engine.algorithms.rotor_router_with_leader_dispersion.models.*;
import engine.app.dto.AlgorithmType;
import engine.app.dto.SimulationState;
import engine.app.dto.SimulationStep;
import engine.core.algorithms.RandomDispersionManager;
import engine.core.algorithms.RandomWithLeaderDispersionManager;
import engine.core.algorithms.RotorRouterDispersionManager;
import engine.core.algorithms.RotorRouterWithLeaderDispersionManager;
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

    @Autowired
    public AlgorithmEngineService(
            RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionManager,
            RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionManager,
            RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionManager,
            RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionManager) {
        this.randomDispersionManager = randomDispersionManager;
        this.randomWithLeaderDispersionManager = randomWithLeaderDispersionManager;
        this.rotorRouterDispersionManager = rotorRouterDispersionManager;
        this.rotorRouterWithLeaderDispersionManager = rotorRouterWithLeaderDispersionManager;

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

    public boolean isDispersionReached(List<? extends Node> nodeList) {
        return nodeList.stream().filter(node -> node.getState().equals(NodeState.OCCUPIED)).count() == nodeList.size();
    }

    public boolean areRobotsFinished(List<? extends Robot> robotList) {
        return robotList.stream().filter(
                robot -> robot.getState().equals(RobotState.SETTLED) || robot.getState().equals(RobotState.TERMINATED))
                .count() == robotList.size();
    }

}
