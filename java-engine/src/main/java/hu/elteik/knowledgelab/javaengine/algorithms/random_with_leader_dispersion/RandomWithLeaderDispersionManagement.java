package hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.elteik.knowledgelab.javaengine.algorithms.random_with_leader_dispersion.models.*;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.LocalLeaderElection;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.RandomNumber;
import hu.elteik.knowledgelab.javaengine.core.algorithms.RandomWithLeaderDispersionManager;
import hu.elteik.knowledgelab.javaengine.core.models.Graph;
import hu.elteik.knowledgelab.javaengine.core.utils.Color;
import hu.elteik.knowledgelab.javaengine.core.utils.NodeState;
import hu.elteik.knowledgelab.javaengine.core.utils.RobotState;

import static java.util.stream.Collectors.groupingBy;

@Component
public class RandomWithLeaderDispersionManagement implements RandomWithLeaderDispersionManager<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot> {

    @Override
    public void step(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, List<RandomWithLeaderDispersionRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private void look(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, List<RandomWithLeaderDispersionRobot> robotList) {
        Map<Long, List<RandomWithLeaderDispersionRobot>> robotsOnDifferentNodes = robotList.stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(groupingBy(RandomWithLeaderDispersionRobot::getOnID));

        for (Map.Entry<Long, List<RandomWithLeaderDispersionRobot>> robotsByNode : robotsOnDifferentNodes.entrySet()) {

            Map<Color, List<RandomWithLeaderDispersionRobot>> robotsGroupedByColorOnNode = robotsByNode.getValue()
                    .stream().collect(groupingBy(RandomWithLeaderDispersionRobot::getColor));

            for (Map.Entry<Color, List<RandomWithLeaderDispersionRobot>> robotsByColor : robotsGroupedByColorOnNode.entrySet()) {
                // There is at least two leader on this node
                if (leaderCount(robotsByColor.getValue()) > 1) {
                    List<RandomWithLeaderDispersionRobot> currentLeadersInOneNode = getCurrentLeaders(robotsByColor.getValue());
                    // Recalculate the winner leader
                    RandomWithLeaderDispersionRobot winnerLeader = new LocalLeaderElection<RandomWithLeaderDispersionRobot>().run(currentLeadersInOneNode);
                    for (RandomWithLeaderDispersionRobot robot : currentLeadersInOneNode){
                        // If there is more leader robot on one node, we set them back to explore state
                        if (!robot.getID().equals(winnerLeader.getID())) {
                            robot.setState(RobotState.EXPLORE);
                        }
                    }
                } else if (leaderCount(robotsByColor.getValue()) == 1) {
                    // System.out.println("We have one leader on node:" + robotsByNode.getKey() + " with color: " + robotsByColor.getKey());
                } else { // => leader count = 0 => need to choose a new one
                    // System.out.println("New leader choosing is happening!");
                    RandomWithLeaderDispersionRobot winnerRobot = new LocalLeaderElection<RandomWithLeaderDispersionRobot>().run(robotsByColor.getValue());
                    robotsByColor.getValue().forEach(robot -> robot.setState(robot.getID().equals(winnerRobot.getID()) ? RobotState.LEADER : RobotState.EXPLORE));
                }
            }
        }
    }

    private void compute(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, List<RandomWithLeaderDispersionRobot> robotList) {

        Map<Long, List<RandomWithLeaderDispersionRobot>> leadersOnDifferentNodes = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(groupingBy(RandomWithLeaderDispersionRobot::getOnID));

        for (Map.Entry<Long, List<RandomWithLeaderDispersionRobot>> leadersByNode : leadersOnDifferentNodes.entrySet()) {

            if (isNodeOccupied(graph, leadersByNode.getKey())) {
                for (RandomWithLeaderDispersionRobot leaderRobot: leadersByNode.getValue()) {
                    //Check if the component still has some free nodes
                    if (isComponentOccupied(graph, leaderRobot.getColor())) {
                        // Terminate the leader and his followers
                        robotList.stream().filter(robot -> robot.getOnID().equals(leaderRobot.getOnID())
                                        && !robot.getState().equals(RobotState.SETTLED))
                                .forEach(follower -> follower.setState(RobotState.TERMINATED));
                    }

                    // Need to find a new path
                    List<Long> edgeOptions = getNewRandomPath(graph, leaderRobot.getOnID(), leaderRobot.getColor());
                    if (edgeOptions.size() > 0) {
                        int random = new RandomNumber().get(0, edgeOptions.size() - 1);
                        leaderRobot.setDestinationID(edgeOptions.get(random));
                    } else {
                        throw new RuntimeException("Leader robot with ID " + leaderRobot.getID() + " stepped into a trap on Node with ID " + leaderRobot.getOnID());
                    }
                }
            } else {
                // Check if the leader is the only robot here and able to settle down
                if (robotCountOnNode(robotList, leadersByNode.getKey()) == 1) {
                    leadersByNode.getValue().get(0).setDestinationID(leadersByNode.getKey()); // If the destination is the same as the on id it will settle there

                } else { // Check if any other group is here IN DIFFERENT COLOR and have election together for settling down

                    List<RandomWithLeaderDispersionRobot> followersInEveryColor = robotList.stream()
                            .filter(robot -> robot.getState().equals(RobotState.EXPLORE) &&
                                    robot.getOnID().equals(leadersByNode.getKey())).collect(Collectors.toList());

                    // If 1 < leader without followers
                    if (followersInEveryColor.size() < 1) {
                        // The leaders have election for settling down
                        RandomWithLeaderDispersionRobot winnerLeader = new LocalLeaderElection<RandomWithLeaderDispersionRobot>().run(leadersByNode.getValue());

                        for (RandomWithLeaderDispersionRobot leader : leadersByNode.getValue()) {
                            if (leader.getID().equals(winnerLeader.getID())) {
                                winnerLeader.setDestinationID(leadersByNode.getKey());
                            } else {
                                List<Long> edgeOptions = getNewRandomPath(graph, leader.getOnID(), leader.getColor());

                                if (edgeOptions.size() > 0) {
                                    int random = new RandomNumber().get(0, edgeOptions.size() - 1);
                                    leader.setDestinationID(edgeOptions.get(random));
                                } else {
                                    throw new RuntimeException("Leader robot with ID " + leader.getID() + " stepped into a trap on Node with ID " + leader.getOnID());
                                }
                            }
                        }
                    } else {
                        // If 1 < leader and someone has followers
                        // Choose a random settler and every other robots move

                        new LocalLeaderElection<RandomWithLeaderDispersionRobot>().run(followersInEveryColor).setDestinationID(leadersByNode.getKey());
                        for (RandomWithLeaderDispersionRobot otherLeader : leadersByNode.getValue()) {
                            List<Long> edgeOptions = getNewRandomPath(graph, otherLeader.getOnID(), otherLeader.getColor());

                            if (edgeOptions.size() > 0) {
                                int random = new RandomNumber().get(0, edgeOptions.size() - 1);
                                otherLeader.setDestinationID(edgeOptions.get(random));
                            } else {
                                throw new RuntimeException("Leader robot with ID " + otherLeader.getID() + " stepped into a trap on Node with ID " + otherLeader.getOnID());
                            }
                        }
                    }
                }
            }
        }
    }

    private void move(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, List<RandomWithLeaderDispersionRobot> robotList) {
        // If a leader has different destinationID than his onID then he will move otherwise settle
        // is a simple robot has a destination he will settle on that.

        Map<Long, List<RandomWithLeaderDispersionRobot>> robotsOnDifferentNodes = robotList.stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED) && !robot.getState().equals(RobotState.TERMINATED))
                .collect(groupingBy(RandomWithLeaderDispersionRobot::getOnID));

        for (Map.Entry<Long, List<RandomWithLeaderDispersionRobot>> robotsByNode : robotsOnDifferentNodes.entrySet()) {

            Map<Color, List<RandomWithLeaderDispersionRobot>> robotsGroupedByColorOnNode = robotsByNode.getValue()
                    .stream().collect(groupingBy(RandomWithLeaderDispersionRobot::getColor));

            for (Map.Entry<Color, List<RandomWithLeaderDispersionRobot>> robotsByColor : robotsGroupedByColorOnNode.entrySet()) {
                RandomWithLeaderDispersionRobot leader = robotsByColor.getValue().stream().filter(robot -> robot.getState().equals(RobotState.LEADER))
                        .collect(Collectors.toList()).get(0);
                if (leader.getOnID().equals(leader.getDestinationID())) {

                    leader.setState(RobotState.SETTLED);
                    settleOnNode(graph, leader.getOnID());
                } else {
                    leader.setOnID(leader.getDestinationID());
                    for (RandomWithLeaderDispersionRobot follower : robotsByColor.getValue().stream().filter(robot -> robot.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList())) {
                        if (follower.getDestinationID() != null){
                            follower.setState(RobotState.SETTLED);
                            settleOnNode(graph, follower.getOnID());
                        } else {
                            follower.setOnID(leader.getDestinationID());
                        }
                    }
                    // Set back to default after move
                    leader.setDestinationID(null);
                }
            }

        }

    }

    private Long leaderCount(List<RandomWithLeaderDispersionRobot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).count();
    }

    private Long robotCountOnNode(List<RandomWithLeaderDispersionRobot> robotList, Long nodeID){
        return robotList.stream().filter(robot -> robot.getOnID().equals(nodeID)).count();
    }

    private List<RandomWithLeaderDispersionRobot> getCurrentLeaders(List<RandomWithLeaderDispersionRobot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).collect(Collectors.toList());
    }

    private boolean isNodeOccupied(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, Long nodeID){
        for (RandomWithLeaderDispersionNode node : graph.getNodeList()) {
            if (node.getID() == nodeID && node.getState().equals(NodeState.OCCUPIED)) return true;
        }
        return false;
    }

    private List<Long> getNewRandomPath(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, long onID, Color color){
        return graph.getEdgeList().stream()
                .filter(edge -> (edge.getFromID().equals(onID) && edge.getColor().equals(color))
                        || (edge.getToID().equals(onID) && edge.getColor().equals(color)))
                .map(edge -> edge.getToID().equals(onID) ? edge.getFromID() : edge.getToID())
                .collect(Collectors.toList());
    }

    private void settleOnNode(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, Long nodeID) {
        for (RandomWithLeaderDispersionNode node : graph.getNodeList()) {
            if (node.getID().equals(nodeID)) {
                node.setState(NodeState.OCCUPIED);
            }
        }
    }

    private boolean isComponentOccupied(Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge> graph, Color component) {
        List<RandomWithLeaderDispersionEdge> componentEdges = graph.getEdgeList().stream().filter(edge -> edge.getColor().equals(component)).collect(Collectors.toList());

        List<Long> fromIDs = componentEdges.stream().map(RandomWithLeaderDispersionEdge::getFromID).collect(Collectors.toList());
        List<Long> toIDs = componentEdges.stream().map(RandomWithLeaderDispersionEdge::getToID).collect(Collectors.toList());
        fromIDs.addAll(toIDs);

        List<Long> componentNodeIDs = fromIDs.stream().distinct().collect(Collectors.toList());
        List<RandomWithLeaderDispersionNode> componentNodes = new ArrayList<>();
        for (Long ID : componentNodeIDs) {
            componentNodes.add(graph.getNodeList().stream().filter(node -> node.getID().equals(ID)).findAny().orElseThrow(() -> new RuntimeException("Node with ID " + ID + " not found!")));
        }

        System.out.println("Szin konponens méret");
        System.out.println(componentNodes.size());

        System.out.println("az elfoglalt szín");
        System.out.println(componentNodes.stream().filter(node -> node.getState().equals(NodeState.OCCUPIED)).count());

        return componentNodes.size() == componentNodes.stream().filter(node -> node.getState().equals(NodeState.OCCUPIED)).count();
    }
    
}
