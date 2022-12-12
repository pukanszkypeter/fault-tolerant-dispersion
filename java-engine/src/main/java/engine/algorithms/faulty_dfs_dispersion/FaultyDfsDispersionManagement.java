package engine.algorithms.faulty_dfs_dispersion;

import java.util.List;
import java.util.stream.Collectors;

import engine.algorithms.faulty_dfs_dispersion.models.*;
import engine.core.algorithms.FaultyDfsDispersionManager;
import engine.core.models.Graph;
import engine.core.utils.NodeState;
import engine.core.utils.RobotPhase;
import engine.core.utils.RobotState;

import org.springframework.stereotype.Component;

@Component
public class FaultyDfsDispersionManagement implements FaultyDfsDispersionManager<FaultyDfsDispersionNode, FaultyDfsDispersionEdge, FaultyDfsDispersionRobot> {

    @Override
    public void step(Graph<FaultyDfsDispersionNode, FaultyDfsDispersionEdge> graph, List<FaultyDfsDispersionRobot> robotList) {

        // active-, inactive- robots
        List<FaultyDfsDispersionRobot> activeRobots = 
            robotList
                .stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED) && !robot.getState().equals(RobotState.CRASHED))
                .collect(Collectors.toList());
        activeRobots.forEach(robot -> robot.setState(RobotState.EXPLORE));
        List<FaultyDfsDispersionRobot> inactiveRobots = 
            robotList
                .stream()
                .filter(robot -> robot.getState().equals(RobotState.SETTLED) && !robot.getState().equals(RobotState.CRASHED))
                .collect(Collectors.toList());

        // current node, edges
        FaultyDfsDispersionNode currentNode = 
            graph
                .getNodeList()
                .stream()
                .filter(node -> node.getID().equals(activeRobots.get(0).getOnID()))
                .findAny()
                .orElse(null);
        List<FaultyDfsDispersionEdge> currentEdges = 
            graph
                .getEdgeList()
                .stream()
                .filter(edge -> currentNode.getID().equals(edge.getFromID()) || currentNode.getID().equals(edge.getToID()))
                .collect(Collectors.toList());

        // extra infos
        boolean isCurrentNodeOccupied = 
            inactiveRobots
                .stream()
                .map(robot -> robot.getOnID())
                .collect(Collectors.toList()).contains(currentNode.getID());
        FaultyDfsDispersionRobot lastRobot = activeRobots.get(activeRobots.size() - 1);

        // COMMUNICATE
        FaultyDfsDispersionRobot router;

        if (!isCurrentNodeOccupied) {

            router = lastRobot;
            router.setState(RobotState.SETTLED);
            router.setParent(router.getLastUsedPort());
            currentNode.setState(NodeState.OCCUPIED);

            // -> Backtrack recalibration condition
            if (router.getPhase().equals(RobotPhase.BACKTRACK)) {
                    activeRobots.stream().forEach(robot -> robot.setTreeLabel(router.getID()));
            }

            activeRobots.stream().forEach(robot -> robot.setEmptyBefore(true));

        } else {

            FaultyDfsDispersionRobot occupier = 
                inactiveRobots
                    .stream()
                    .filter(robot -> robot.getOnID().equals(currentNode.getID()))
                    .findAny()
                    .orElse(null);
            router = occupier;

            // -> Forward recalibration condition
            if (
                lastRobot.getPhase().equals(RobotPhase.FORWARD) && 
                (router.getParent() == lastRobot.getLastUsedPort() || router.getChild() == lastRobot.getLastUsedPort()) && 
                lastRobot.getTreeLabel() == router.getTreeLabel() && 
                lastRobot.isEmptyBefore()
                ) {
                    activeRobots.stream().forEach(robot -> robot.setTreeLabel(router.getID()));
                    router.setTreeLabel(router.getID());
                    router.setParent(lastRobot.getLastUsedPort());
                    router.setChild(0);
            }

            // -> Overwrite router
            if (lastRobot.getTreeLabel() < router.getTreeLabel()) {
                router.setTreeLabel(lastRobot.getTreeLabel());
                router.setParent(lastRobot.getLastUsedPort());
                router.setChild(0);
            }

            activeRobots.stream().forEach(robot -> robot.setEmptyBefore(false));

        }

        // COMPUTE
        int nodeDegree = (int) currentEdges.stream().count();
        int oldChild = router.getChild();

        if (oldChild <= nodeDegree) {
            if (oldChild + 1 != router.getParent()) {
                router.setChild(oldChild + 1);
            } else {
                router.setChild(oldChild + 2);
            }
        }

        FaultyDfsDispersionEdge travelEdge = 
            currentEdges
                .stream()
                .filter(edge -> edge.getFromID().equals(currentNode.getID())
                        ? edge.getFromPort() == router.getChild()
                        : edge.getToPort() == router.getChild())
                .findAny() // -> FORWARD PHASE
                .orElseGet(() -> { // -> BACKTRACK PHASE
                    return currentEdges
                            .stream()
                            .filter(edge -> edge.getFromID().equals(currentNode.getID())
                                    ? edge.getFromPort() == router.getParent()
                                    : edge.getToPort() == router.getParent())
                            .findAny()
                            .orElse(null);
                });

        // MOVE
        List<FaultyDfsDispersionRobot> travelers = 
            robotList
                .stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED) && !robot.getState().equals(RobotState.CRASHED))
                .collect(Collectors.toList());
        int exitPort = 
            travelEdge
                .getFromID()
                .equals(currentNode.getID()) ? travelEdge.getFromPort(): travelEdge.getToPort();

        FaultyDfsDispersionNode travelDestination = 
            graph
                .getNodeList()
                .stream()
                .filter(node -> node.getID().equals(
                                    travelEdge.getFromID().equals(currentNode.getID()) 
                                        ? travelEdge.getToID()
                                        : travelEdge.getFromID()))
                .findAny()
                .orElse(null);
        if (!inactiveRobots.stream().map(robot -> robot.getOnID()).collect(Collectors.toList()).contains(travelDestination.getID()) && travelers.size() > 0) {
            travelDestination.setState(NodeState.PENDING);
        }

        for (int i = 0; i < travelers.size(); i++) {
            travelers.get(i).setOnID(
                    travelEdge.getFromPort() == exitPort ? travelEdge.getToID() : travelEdge.getFromID());
            travelers.get(i).setLastUsedPort(
                    travelEdge.getFromPort() == exitPort ? travelEdge.getToPort() : travelEdge.getFromPort());
            travelers.get(i).setPhase(
                    router.getParent() == exitPort ? RobotPhase.BACKTRACK : 
                        (lastRobot.getLastUsedPort() != router.getParent() && lastRobot.getLastUsedPort() != oldChild) ? 
                            RobotPhase.BACKTRACK : RobotPhase.FORWARD);
        }

    }
    
}
