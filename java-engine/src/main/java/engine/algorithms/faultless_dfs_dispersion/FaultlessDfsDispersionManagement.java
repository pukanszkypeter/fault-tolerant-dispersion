package engine.algorithms.faultless_dfs_dispersion;

import java.util.List;

import engine.algorithms.faultless_dfs_dispersion.models.*;
import engine.core.algorithms.FaultlessDfsDispersionManager;
import engine.core.models.Graph;
import engine.core.utils.NodeState;
import engine.core.utils.RobotState;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class FaultlessDfsDispersionManagement
        implements FaultlessDfsDispersionManager<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge, FaultlessDfsDispersionRobot> {

    @Override
    public void step(Graph<FaultlessDfsDispersionNode, FaultlessDfsDispersionEdge> graph, List<FaultlessDfsDispersionRobot> robotList) {
        
        // Active-, Inactive- Robots
        List<FaultlessDfsDispersionRobot> activeRobots = 
            robotList
                .stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(Collectors.toList());
        activeRobots.forEach(robot -> robot.setState(RobotState.EXPLORE));
        List<FaultlessDfsDispersionRobot> inactiveRobots = 
            robotList
                .stream()
                .filter(robot -> robot.getState().equals(RobotState.SETTLED))
                .collect(Collectors.toList());

        // Current node and edges
        FaultlessDfsDispersionNode currentNode = 
            graph
                .getNodeList()
                .stream()
                .filter(node -> node.getID().equals(activeRobots.get(0).getOnID()))
                .findAny()
                .orElse(null);
        List<FaultlessDfsDispersionEdge> currentEdges = 
            graph
                .getEdgeList()
                .stream()
                .filter(edge -> currentNode.getID().equals(edge.getFromID()) || currentNode.getID().equals(edge.getToID()))
                .collect(Collectors.toList());

        // Helper attributes
        boolean isCurrentNodeOccupied = 
            inactiveRobots
                .stream()
                .map(robot -> robot.getOnID())
                .collect(Collectors.toList())
                .contains(currentNode.getID());
        int nodeDegree = (int) currentEdges.stream().count();

        // COMMUNICATE
        FaultlessDfsDispersionRobot router;

        if (!isCurrentNodeOccupied) {
            router = activeRobots.get(activeRobots.size() - 1);
            router.setState(RobotState.SETTLED);
            router.setParent(router.getLastUsedPort());
            currentNode.setState(NodeState.OCCUPIED);
        } else {
            FaultlessDfsDispersionRobot occupier = 
                inactiveRobots
                    .stream()
                    .filter(robot -> robot.getOnID() == currentNode.getID())
                    .findAny()
                    .orElse(null);
            router = occupier;
        }

        // COMPUTE
        int oldChildValue = router.getChild();

        if (oldChildValue <= nodeDegree) {
            if (oldChildValue + 1 != router.getParent()) {
                router.setChild(oldChildValue + 1);
            } else {
                router.setChild(oldChildValue + 2);
            }
        }

        FaultlessDfsDispersionEdge travelEdge = 
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
        List<FaultlessDfsDispersionRobot> travelers = 
            robotList
                .stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(Collectors.toList());

        FaultlessDfsDispersionNode travelDestination = 
            graph
                .getNodeList()
                .stream()
                .filter(node -> node.getID().equals(
                                    travelEdge.getFromID().equals(currentNode.getID()) 
                                        ? travelEdge.getToID()
                                        : travelEdge.getFromID()))
                .findAny()
                .orElse(null);

        if (!inactiveRobots.stream().map(robot -> robot.getOnID()).collect(Collectors.toList()).contains(travelDestination.getID())) {
            travelDestination.setState(NodeState.PENDING);
        }

        for (int i = 0; i < travelers.size(); i++) {
            travelers.get(i).setOnID(travelDestination.getID());
            travelers.get(i).setLastUsedPort(
                    travelEdge.getFromID().equals(currentNode.getID()) ? travelEdge.getToPort()
                            : travelEdge.getFromPort());
        }
    }

}
