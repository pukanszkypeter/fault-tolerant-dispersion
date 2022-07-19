package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.algorithms.utils.LocalLeaderElection;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.RandomNumber;
import hu.elteik.knowledgelab.javaengine.core.models.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

public class RandomWithLeaderDispersion {

    public void step(Graph graph, List<Robot> robotList) {

        handleLeadersForEveryGroup(robotList);

        if (isEveryGroupHasLeader(robotList)) {
            //Check the node is occupied
            List<Robot> leaderRobots = getCurrentLeaders(robotList);
            //Look through

            for (Robot leader: leaderRobots) {
                if (!isNodeOccupied(graph, leader.getOnID())){
                    if (robotList.stream().noneMatch(robot -> robot.getOnID().equals(leader.getOnID()))) {
                        // Leader is settling down
                        leader.setState(RobotState.SETTLED);
                        settleOnNode(leader.getOnID(), graph);
                    } else {
                        // Choose someone to settle down from current robot group

                        List<Robot> currentLeaderSGroup = robotList.stream().filter(robot ->
                                robot.getOnID().equals(leader.getOnID()) && robot.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList());
                        
                        new LocalLeaderElection().run(currentLeaderSGroup).setState(RobotState.SETTLED);
                        settleOnNode(leader.getOnID(), graph);
                    }
                } else {
                    // Every leader have to find a new route
                    //Follow the leader
                    long newPath = chooseNewRandomPath(graph, leader.getOnID());
                    followTheLeader(robotList, leader.getOnID(), newPath);
                    leader.setOnID(newPath);
                }
            }
        } else {
            handleLeadersForEveryGroup(robotList);
        }

    }

    public void handleLeadersForEveryGroup(List<Robot> robotList) {
        //get robots by onID
        Map<Long, List<Robot>> robotsOnDifferentNodes = robotList.stream()
                .collect(groupingBy(Robot::getOnID));

        for (Map.Entry<Long, List<Robot>> entry : robotsOnDifferentNodes.entrySet()) {
            //There is at least two leader on this node
            if (leaderCountOnNode(entry.getValue()) > 1) {
                List<Robot> currentLeadersInOneNode = getCurrentLeaders(entry.getValue());
                //Recalculate the winner leader
                Robot winnerLeader = new LocalLeaderElection().run(currentLeadersInOneNode);
                for (Robot robot : entry.getValue()){
                    //If there is more leader robot on one node, we set them back to explore state
                    if ((robot.getState().equals(RobotState.LEADER)
                            && robot.getOnID().equals(winnerLeader.getOnID())
                            && !robot.getID().equals(winnerLeader.getID()))) {

                        robot.setState(RobotState.EXPLORE);
                    }
                }
            } else { // => leader count = 0 => need to choose a new one
                new LocalLeaderElection().run(entry.getValue()).setState(RobotState.LEADER);
            }

        }

    }

    public void followTheLeader(List<Robot> robotList, long oldOnId, long newOnId) {
        robotList.stream().filter(robot ->
            robot.getOnID().equals(oldOnId) && robot.getState().equals(RobotState.EXPLORE)
        ).forEach(robot -> robot.setOnID(newOnId));
    }

    public boolean isEveryGroupHasLeader(List<Robot> robotList){
        //get robots by onID
        Map<Long, List<Robot>> robotsOnDifferentNodes = robotList.stream()
                .collect(groupingBy(Robot::getOnID));

        // Check if every robot group has his own leader
        for (Map.Entry<Long, List<Robot>> entry : robotsOnDifferentNodes.entrySet()) {
            if (leaderCountOnNode(entry.getValue()) == 0) {
                return false;
            }
        }
        return true;
    }

    public long leaderCountOnNode(List<Robot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).count();
    }

    public boolean isNodeOccupied(Graph graph, long nodeId){
        for (Node node : graph.getNodeList()) {
            if (node.getID() == nodeId && node.getState().equals(NodeState.OCCUPIED)) return true;
        }
        return false;
    }

    public Robot getCurrentLeader(List<Robot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).findFirst().get();
    }

    public List<Robot> getCurrentLeaders(List<Robot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).collect(Collectors.toList());
    }

    public long chooseNewRandomPath(Graph graph, long nodeId){
        int edgeCount = (int) graph.getEdgeList().stream().filter(edge -> edge.getToID() == nodeId || edge.getFromID() == nodeId).count();

        int choosenPath = new RandomNumber().get(0, edgeCount);
        return graph.getEdgeList().stream()
                .filter(edge -> edge.getToID() == nodeId || edge.getFromID() == nodeId)
                .map(edge -> (edge.getToID().equals(nodeId)) ? edge.getFromID() : edge.getFromID())
                .collect(Collectors.toList()).get(choosenPath);

    }

    public void settleOnNode(long nodeId, Graph graph) {
        for (Node node : graph.getNodeList()) {
            if (node.getID().equals(nodeId)) {
                node.setState(NodeState.OCCUPIED);
            }
        }
    }
}
