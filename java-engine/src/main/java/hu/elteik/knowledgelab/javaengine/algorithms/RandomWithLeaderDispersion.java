package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.algorithms.utils.LocalLeaderElection;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.RandomNumber;
import hu.elteik.knowledgelab.javaengine.core.models.base.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

public class RandomWithLeaderDispersion {

    public void step(Graph graph, List<Robot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private void look(Graph graph, List<Robot> robotList) {
        Map<Long, List<Robot>> robotsOnDifferentNodes = robotList.stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(groupingBy(Robot::getOnID));

        for (Map.Entry<Long, List<Robot>> robotsByNode : robotsOnDifferentNodes.entrySet()) {

            Map<Color, List<Robot>> robotsGroupedByColorOnNode = robotsByNode.getValue()
                    .stream().collect(groupingBy(Robot::getColor));

            for (Map.Entry<Color, List<Robot>> robotsByColor : robotsGroupedByColorOnNode.entrySet()) {
                //There is at least two leader on this node
                if (leaderCount(robotsByColor.getValue()) > 1) {
                    List<Robot> currentLeadersInOneNode = getCurrentLeaders(robotsByColor.getValue());
                    //Recalculate the winner leader
                    Robot winnerLeader = new LocalLeaderElection().run(currentLeadersInOneNode);
                    for (Robot robot : currentLeadersInOneNode){
                        //If there is more leader robot on one node, we set them back to explore state
                        if (!robot.getID().equals(winnerLeader.getID())) {
                            robot.setState(RobotState.EXPLORE);
                        }
                    }
                } else if (leaderCount(robotsByColor.getValue()) == 1) {
                    System.out.println("We have one leader on node:" + robotsByNode.getKey() + " with color: " + robotsByColor.getKey());
                } else { // => leader count = 0 => need to choose a new one
                    System.out.println("new leader choosing is hapening!");
                    Robot winnerRobot = new LocalLeaderElection().run(robotsByColor.getValue());
                    robotsByColor.getValue().forEach(robot -> robot.setState(robot.getID().equals(winnerRobot.getID()) ? RobotState.LEADER : RobotState.EXPLORE));
                }
            }
        }
    }

    private void compute(Graph graph, List<Robot> robotList) {
        //List<Robot> leaderRobots = getCurrentLeaders(robotList);

        Map<Long, List<Robot>> leadersOnDifferentNodes = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(groupingBy(Robot::getOnID));

        for (Map.Entry<Long, List<Robot>> leadersByNode : leadersOnDifferentNodes.entrySet()) {

            if (isNodeOccupied(graph, leadersByNode.getKey())) {
                for (Robot leaderRobot: leadersByNode.getValue()) {
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
                        leadersByNode.getValue().get(0).setDestinationID(leadersByNode.getKey()); // if the destination is the same as the on id it will settle there

                    } else { // Check if any other group is here IN DIFFERENT COLOR and have election together for settling down

                        List<Robot> followersInEveryColor = robotList.stream()
                                .filter(robot -> robot.getState().equals(RobotState.EXPLORE) &&
                                        robot.getOnID().equals(leadersByNode.getKey())).collect(Collectors.toList());

                        // if 1 < leader without followers
                        if (followersInEveryColor.size() < 1) {
                            //The leaders have election for settling down
                            Robot winnerLeader = new LocalLeaderElection().run(leadersByNode.getValue());

                            for (Robot leader : leadersByNode.getValue()) {
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
                            //if 1 < leader and someone has followers
                            // Choose a random settler and every other robots move

                            new LocalLeaderElection().run(followersInEveryColor).setDestinationID(leadersByNode.getKey());
                            for (Robot otherLeader : leadersByNode.getValue()) {
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

    private void move(Graph graph, List<Robot> robotList) {
        // if a leader has different destinationID than his onID then he will move otherwise settle
        // is a simple robot has a destination he will settle on that.

        Map<Long, List<Robot>> robotsOnDifferentNodes = robotList.stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(groupingBy(Robot::getOnID));

        for (Map.Entry<Long, List<Robot>> robotsByNode : robotsOnDifferentNodes.entrySet()) {

            Map<Color, List<Robot>> robotsGroupedByColorOnNode = robotsByNode.getValue()
                    .stream().collect(groupingBy(Robot::getColor));

            for (Map.Entry<Color, List<Robot>> robotsByColor : robotsGroupedByColorOnNode.entrySet()) {
                Robot leader = robotsByColor.getValue().stream().filter(robot -> robot.getState().equals(RobotState.LEADER))
                        .collect(Collectors.toList()).get(0);
                if (leader.getOnID().equals(leader.getDestinationID())) {

                    leader.setState(RobotState.SETTLED);
                    settleOnNode(leader.getOnID(), graph);
                } else {
                    leader.setOnID(leader.getDestinationID());
                    for (Robot follower : robotsByColor.getValue().stream().filter(robot -> robot.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList())) {
                        if (follower.getDestinationID() != null){
                            follower.setState(RobotState.SETTLED);
                            settleOnNode(follower.getOnID(), graph);
                        } else {
                            follower.setOnID(leader.getDestinationID());
                        }
                    }
                    //set back to default after move
                    leader.setDestinationID(null);
                }
            }

        }

    }


    public long leaderCount(List<Robot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).count();
    }

    public long leaderCountOnNode(List<Robot> robotList, long nodeID){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER) && robot.getOnID().equals(nodeID)).count();
    }


    public long robotCountOnNode(List<Robot> robotList, long nodeID){
        return robotList.stream().filter(robot -> robot.getOnID().equals(nodeID)).count();
    }

    public List<Robot> getCurrentLeaders(List<Robot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).collect(Collectors.toList());
    }

    public boolean isNodeOccupied(Graph graph, long nodeId){
        for (Node node : graph.getNodeList()) {
            if (node.getID() == nodeId && node.getState().equals(NodeState.OCCUPIED)) return true;
        }
        return false;
    }

    public List<Long> getNewRandomPath(Graph graph, long onID, Color color){
        return graph.getEdgeList().stream()
                .filter(edge -> (edge.getFromID().equals(onID) && edge.getColor().equals(color))
                        || (edge.getToID().equals(onID) && edge.getColor().equals(color)))
                .map(edge -> edge.getToID().equals(onID) ? edge.getFromID() : edge.getToID())
                .collect(Collectors.toList());
    }

    public void settleOnNode(long nodeId, Graph graph) {
        for (Node node : graph.getNodeList()) {
            if (node.getID().equals(nodeId)) {
                node.setState(NodeState.OCCUPIED);
            }
        }
    }

}
