package hu.elteik.knowledgelab.javaengine.app;

import hu.elteik.knowledgelab.javaengine.algorithms.random_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.rotor_router_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.app.dto.AlgorithmType;
import hu.elteik.knowledgelab.javaengine.app.dto.SimulationState;
import hu.elteik.knowledgelab.javaengine.app.dto.SimulationStep;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RandomDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RandomWithLeaderDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RotorRouterDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RotorRouterWithLeaderDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.models.Node;
import hu.elteik.knowledgelab.javaengine.core.models.Robot;
import hu.elteik.knowledgelab.javaengine.core.utils.NodeState;
import hu.elteik.knowledgelab.javaengine.core.utils.RobotState;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.ApplicationScope;


@Service
@ApplicationScope
public class AlgorithmEngineService {

    private final RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionManager;
    private final RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionManager;
    private final RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionManager;
    private final RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionManager;

    @Autowired
    public AlgorithmEngineService(RandomDispersionManager<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionManager, 
                            RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionManager, 
                            RotorRouterDispersionManager<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionManager, 
                            RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionManager) {
        this.randomDispersionManager = randomDispersionManager;
        this.randomWithLeaderDispersionManager = randomWithLeaderDispersionManager;
        this.rotorRouterDispersionManager = rotorRouterDispersionManager;
        this.rotorRouterWithLeaderDispersionManager = rotorRouterWithLeaderDispersionManager;

    }

    public SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> randomDispersionStep(SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
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

    public Long randomDispersionTest(SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot> step) {
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

    public SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> randomWithLeaderDispersionStep(SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
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

    public Long randomWithLeaderDispersionTest(SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> step) {
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

    public SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> rotorRouterDispersionStep(SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
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

    public Long rotorRouterDispersionTest(SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot> step) {
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

    public SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> rotorRouterWithLeaderDispersionStep(SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
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

    public Long rotorRouterWithLeaderDispersionTest(SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> step) {
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
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.SETTLED) || robot.getState().equals(RobotState.TERMINATED)).count() == robotList.size();
    }

}
