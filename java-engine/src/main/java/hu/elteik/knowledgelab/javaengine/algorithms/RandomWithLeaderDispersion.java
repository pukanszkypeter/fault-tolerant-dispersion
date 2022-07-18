package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.algorithms.utils.LocalLeaderElection;
import hu.elteik.knowledgelab.javaengine.algorithms.utils.RandomNumber;
import hu.elteik.knowledgelab.javaengine.core.models.*;

import java.util.List;
import java.util.stream.Collectors;

public class RandomWithLeaderDispersion {

    public void step(Graph graph, List<Robot> robotList) {
        if (!isLeaderAlive(robotList)){
            // Choose leader


            //Choose settler and occupie the first node


            //Find the next node
        }

        if (isLeaderAlive(robotList)) {
            //Check the node is occupied
            Robot leaderRobot = getCurrentLeader(robotList);
            if (!isNodeOccupied(graph, leaderRobot.getOnID())) {
                //Check the leader is the only one here
                if (robotList.stream().noneMatch(robot -> robot.getOnID().equals(leaderRobot.getOnID()))) {
                    // Leader is settling down
                    getCurrentLeader(robotList).setState(RobotState.SETTLED);
                    settleOnNode(leaderRobot.getOnID(), graph);

                } else {
                    // Choose someone to settle down
                    new LocalLeaderElection().run(robotList).setState(RobotState.SETTLED);
                    settleOnNode(leaderRobot.getOnID(), graph);
                }
            } else {
                // Find a new route
                getCurrentLeader(robotList).setOnID(chooseNewRandomPath(graph, leaderRobot.getOnID()));
            }

            // Follow the leader

            /*robotList.stream()
                    .filter()
                    
             */
        }

    }

    public boolean isLeaderAlive(List<Robot> robotList) {
        for (Robot robot : robotList) {
            if (robot.getState().equals(RobotState.LEADER)) return true;
        }
        return false;
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
