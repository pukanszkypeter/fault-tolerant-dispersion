package hu.elteik.knowledgelab.javaengine.algorithms;

import hu.elteik.knowledgelab.javaengine.algorithms.utils.LocalLeaderElection;
import hu.elteik.knowledgelab.javaengine.core.models.base.*;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderGraph;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderNode;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderRobot;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

public class RotorRouterWithLeaderDispersion {

    public void step(RotorRouterWithLeaderGraph graph, List<RotorRouterWithLeaderRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private void look(RotorRouterWithLeaderGraph graph, List<RotorRouterWithLeaderRobot> robotList) {
        Map<Long, List<RotorRouterWithLeaderRobot>> robotsOnDifferentRotorRouterWithLeaderNodes = robotList.stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(groupingBy(RotorRouterWithLeaderRobot::getOnID));

        for (Map.Entry<Long, List<RotorRouterWithLeaderRobot>> robotsByRotorRouterWithLeaderNode : robotsOnDifferentRotorRouterWithLeaderNodes.entrySet()) {

            Map<Color, List<RotorRouterWithLeaderRobot>> robotsGroupedByColorOnRotorRouterWithLeaderNode = robotsByRotorRouterWithLeaderNode.getValue()
                    .stream().collect(groupingBy(RotorRouterWithLeaderRobot::getColor));

            for (Map.Entry<Color, List<RotorRouterWithLeaderRobot>> robotsByColor : robotsGroupedByColorOnRotorRouterWithLeaderNode.entrySet()) {
                //There is at least two leader on this node
                if (leaderCount(robotsByColor.getValue()) > 1) {
                    List<RotorRouterWithLeaderRobot> currentLeadersInOneRotorRouterWithLeaderNode = getCurrentLeaders(robotsByColor.getValue());
                    //Recalculate the winner leader
                    RotorRouterWithLeaderRobot winnerLeader = new LocalLeaderElection<RotorRouterWithLeaderRobot>().run(currentLeadersInOneRotorRouterWithLeaderNode);
                    for (RotorRouterWithLeaderRobot robot : currentLeadersInOneRotorRouterWithLeaderNode){
                        //If there is more leader robot on one node, we set them back to explore state
                        if (!robot.getID().equals(winnerLeader.getID())) {
                            robot.setState(RobotState.EXPLORE);
                        }
                    }
                } else if (leaderCount(robotsByColor.getValue()) == 1) {
                    System.out.println("We have one leader on node:" + robotsByRotorRouterWithLeaderNode.getKey() + " with color: " + robotsByColor.getKey());
                } else { // => leader count = 0 => need to choose a new one
                    System.out.println("new leader choosing is hapening!");
                    RotorRouterWithLeaderRobot winnerRotorRouterWithLeaderRobot = new LocalLeaderElection<RotorRouterWithLeaderRobot>().run(robotsByColor.getValue());
                    robotsByColor.getValue().forEach(robot -> robot.setState(robot.getID().equals(winnerRotorRouterWithLeaderRobot.getID()) ? RobotState.LEADER : RobotState.EXPLORE));
                }
            }
        }
    }

    private void compute(RotorRouterWithLeaderGraph graph, List<RotorRouterWithLeaderRobot> robotList) {

        Map<Long, List<RotorRouterWithLeaderRobot>> leadersOnDifferentRotorRouterWithLeaderNodes = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(groupingBy(RotorRouterWithLeaderRobot::getOnID));

        for (Map.Entry<Long, List<RotorRouterWithLeaderRobot>> leadersByRotorRouterWithLeaderNode : leadersOnDifferentRotorRouterWithLeaderNodes.entrySet()) {

            if (isRotorRouterWithLeaderNodeOccupied(graph, leadersByRotorRouterWithLeaderNode.getKey())) {
                for (RotorRouterWithLeaderRobot leaderRotorRouterWithLeaderRobot: leadersByRotorRouterWithLeaderNode.getValue()) {
                    // Need to find a new path
                    long newPath = getNewPath(graph, leaderRotorRouterWithLeaderRobot.getOnID(), leaderRotorRouterWithLeaderRobot.getColor());
                    leaderRotorRouterWithLeaderRobot.setDestinationID(newPath);

                    Edge usedEdge = graph.getEdgeList().stream()
                            .filter(edge -> (edge.getFromID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) &&
                                    edge.getToID().equals(newPath) && edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor()))
                                    ||
                                    (edge.getToID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) &&
                                            edge.getFromID().equals(newPath) && edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor()))
                            ).collect(Collectors.toList()).get(0);
                    leaderRotorRouterWithLeaderRobot.setLastUsedEdgeID(usedEdge.getID());

                }
            } else {
                // Check if the leader is the only robot here and able to settle down
                if (robotCountOnRotorRouterWithLeaderNode(robotList, leadersByRotorRouterWithLeaderNode.getKey()) == 1) {

                    //Set the initial lastPort from where he came from
                    setTheFirstPortIndexOnRotorRouterWithLeaderNode(graph, leadersByRotorRouterWithLeaderNode.getValue().get(0));

                    leadersByRotorRouterWithLeaderNode.getValue().get(0).setDestinationID(leadersByRotorRouterWithLeaderNode.getKey()); // if the destination is the same as the on id it will settle there


                } else { // Check if any other group is here IN DIFFERENT COLOR and have election together for settling down
                    List<RotorRouterWithLeaderRobot> followersInEveryColor = robotList.stream()
                            .filter(robot -> robot.getState().equals(RobotState.EXPLORE) &&
                                    robot.getOnID().equals(leadersByRotorRouterWithLeaderNode.getKey())).collect(Collectors.toList());

                    // if 1 < leader without followers
                    if (followersInEveryColor.size() < 1) {
                        //The leaders have election for settling down
                        RotorRouterWithLeaderRobot winnerLeader = new LocalLeaderElection<RotorRouterWithLeaderRobot>().run(leadersByRotorRouterWithLeaderNode.getValue());

                        for (RotorRouterWithLeaderRobot leader : leadersByRotorRouterWithLeaderNode.getValue()) {
                            if (leader.getID().equals(winnerLeader.getID())) {

                                //Set the initial lastPort from where he came from
                                setTheFirstPortIndexOnRotorRouterWithLeaderNode(graph, winnerLeader);

                                winnerLeader.setDestinationID(leadersByRotorRouterWithLeaderNode.getKey());

                            } else {

                                //Find a new path

                                long newPath = getNewPath(graph, leader.getOnID(), leader.getColor());
                                leader.setDestinationID(newPath);

                                Edge usedEdge = graph.getEdgeList().stream()
                                        .filter(edge -> (edge.getFromID().equals(leader.getOnID()) &&
                                                edge.getToID().equals(newPath) && edge.getColor().equals(leader.getColor()))
                                                ||
                                                (edge.getToID().equals(leader.getOnID()) &&
                                                        edge.getFromID().equals(newPath) && edge.getColor().equals(leader.getColor()))
                                        ).collect(Collectors.toList()).get(0);
                                leader.setLastUsedEdgeID(usedEdge.getID());
                            }
                        }
                    } else {
                        //if 1 < leader and someone has followers
                        // Choose a random settler and every other robots move

                        RotorRouterWithLeaderRobot settlerFollower = new LocalLeaderElection<RotorRouterWithLeaderRobot>().run(followersInEveryColor);

                        //Find the leader of the settler
                        RotorRouterWithLeaderRobot leaderForSettler = robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)
                                && robot.getOnID().equals(settlerFollower.getOnID()) && robot.getColor().equals(settlerFollower.getColor()))
                                .collect(Collectors.toList()).get(0);

                        setTheFirstPortIndexOnRotorRouterWithLeaderNode(graph, leaderForSettler);

                        settlerFollower.setDestinationID(leadersByRotorRouterWithLeaderNode.getKey());


                        for (RotorRouterWithLeaderRobot otherLeader : leadersByRotorRouterWithLeaderNode.getValue()) {

                            long newPath = getNewPath(graph, otherLeader.getOnID(), otherLeader.getColor());
                            otherLeader.setDestinationID(newPath);

                            Edge usedEdge = graph.getEdgeList().stream()
                                    .filter(edge -> (edge.getFromID().equals(otherLeader.getOnID()) &&
                                            edge.getToID().equals(newPath) && edge.getColor().equals(otherLeader.getColor()))
                                            ||
                                            (edge.getToID().equals(otherLeader.getOnID()) &&
                                                    edge.getFromID().equals(newPath) && edge.getColor().equals(otherLeader.getColor()))
                                    ).collect(Collectors.toList()).get(0);
                            otherLeader.setLastUsedEdgeID(usedEdge.getID());

                        }
                    }
                }
            }
        }
    }

    private void move(RotorRouterWithLeaderGraph graph, List<RotorRouterWithLeaderRobot> robotList) {
        // if a leader has different destinationID than his onID then he will move otherwise settle
        // is a simple robot has a destination he will settle on that.

        Map<Long, List<RotorRouterWithLeaderRobot>> robotsOnDifferentRotorRouterWithLeaderNodes = robotList.stream()
                .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
                .collect(groupingBy(RotorRouterWithLeaderRobot::getOnID));

        for (Map.Entry<Long, List<RotorRouterWithLeaderRobot>> robotsByRotorRouterWithLeaderNode : robotsOnDifferentRotorRouterWithLeaderNodes.entrySet()) {

            Map<Color, List<RotorRouterWithLeaderRobot>> robotsGroupedByColorOnRotorRouterWithLeaderNode = robotsByRotorRouterWithLeaderNode.getValue()
                    .stream().collect(groupingBy(RotorRouterWithLeaderRobot::getColor));

            for (Map.Entry<Color, List<RotorRouterWithLeaderRobot>> robotsByColor : robotsGroupedByColorOnRotorRouterWithLeaderNode.entrySet()) {
                RotorRouterWithLeaderRobot leader = robotsByColor.getValue().stream().filter(robot -> robot.getState().equals(RobotState.LEADER))
                        .collect(Collectors.toList()).get(0);
                if (leader.getOnID().equals(leader.getDestinationID())) {

                    leader.setState(RobotState.SETTLED);
                    settleOnRotorRouterWithLeaderNode(leader.getOnID(), graph);
                } else {
                    leader.setOnID(leader.getDestinationID());
                    for (RotorRouterWithLeaderRobot follower : robotsByColor.getValue().stream().filter(robot -> robot.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList())) {
                        if (follower.getDestinationID() != null){
                            follower.setState(RobotState.SETTLED);
                            settleOnRotorRouterWithLeaderNode(follower.getOnID(), graph);
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


    public long leaderCount(List<RotorRouterWithLeaderRobot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).count();
    }

    public long robotCountOnRotorRouterWithLeaderNode(List<RotorRouterWithLeaderRobot> robotList, long nodeID){
        return robotList.stream().filter(robot -> robot.getOnID().equals(nodeID)).count();
    }

    public List<RotorRouterWithLeaderRobot> getCurrentLeaders(List<RotorRouterWithLeaderRobot> robotList){
        return robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)).collect(Collectors.toList());
    }

    public boolean isRotorRouterWithLeaderNodeOccupied(RotorRouterWithLeaderGraph graph, long nodeId){
        for (RotorRouterWithLeaderNode node : graph.getRotorRouterWithLeaderNodeList()) {
            if (node.getID() == nodeId && node.getState().equals(NodeState.OCCUPIED)) return true;
        }
        return false;
    }

    public Long getNewPath(RotorRouterWithLeaderGraph graph, long onID, Color color) {
        List<Long> edgeOptions = graph.getEdgeList().stream()
                .filter(edge -> (edge.getFromID().equals(onID) && edge.getColor().equals(color))
                        || (edge.getToID().equals(onID) && edge.getColor().equals(color)))
                .map(edge -> edge.getToID().equals(onID) ? edge.getFromID() : edge.getToID())
                .collect(Collectors.toList());

        RotorRouterWithLeaderNode currentRotorRouterWithLeaderNode = graph.getRotorRouterWithLeaderNodeList().stream().filter(node -> node.getID().equals(onID)).collect(Collectors.toList()).get(0);


        // If the current rotor portID < edge options size, we can choose the next edge option

        if (currentRotorRouterWithLeaderNode.getCurrentComponentPointer() == null) {
            currentRotorRouterWithLeaderNode.setCurrentComponentPointer(new HashMap<>());
            currentRotorRouterWithLeaderNode.getCurrentComponentPointer().put(color, 0L);
        }

        if (currentRotorRouterWithLeaderNode.getCurrentComponentPointer().get(color) == null) {
            currentRotorRouterWithLeaderNode.getCurrentComponentPointer().put(color, 0L);
        }



        if (currentRotorRouterWithLeaderNode.getCurrentComponentPointer().get(color) < edgeOptions.size() - 1) {

            currentRotorRouterWithLeaderNode.getCurrentComponentPointer().put(color, (currentRotorRouterWithLeaderNode.getCurrentComponentPointer().get(color) + 1));
        } else if (edgeOptions.size() == 1){
            System.out.println("Tehre is no more new option, go on the only option we have");
        } else if (edgeOptions.size() == 0) {
            throw new RuntimeException("Leader robot stepped into a trap on RotorRouterWithLeaderNode with ID " + onID);
        } else {
            // If we already checked the all edge, we start from the 0 option!
            //currentRotorRouterWithLeaderNode.setLastPortIndex(0L);
            currentRotorRouterWithLeaderNode.getCurrentComponentPointer().put(color, 0L);
        }

        return edgeOptions.get(currentRotorRouterWithLeaderNode.getCurrentComponentPointer().get(color).intValue());
    }

    public void settleOnRotorRouterWithLeaderNode(long nodeId, RotorRouterWithLeaderGraph graph) {
        for (RotorRouterWithLeaderNode node : graph.getRotorRouterWithLeaderNodeList()) {
            if (node.getID().equals(nodeId)) {
                node.setState(NodeState.OCCUPIED);
            }
        }
    }


    public void setTheFirstPortIndexOnRotorRouterWithLeaderNode(RotorRouterWithLeaderGraph graph, RotorRouterWithLeaderRobot leaderRotorRouterWithLeaderRobot) {

        RotorRouterWithLeaderNode currentRotorRouterWithLeaderNode = graph.getRotorRouterWithLeaderNodeList().stream()
                .filter(node -> node.getID().equals(leaderRotorRouterWithLeaderRobot.getOnID())).collect(Collectors.toList()).get(0);

        if (leaderRotorRouterWithLeaderRobot.getLastUsedEdgeID() == null) {
            System.out.println("The first step");
            currentRotorRouterWithLeaderNode.setCurrentComponentPointer(new HashMap<>());
            currentRotorRouterWithLeaderNode.getCurrentComponentPointer().put(leaderRotorRouterWithLeaderRobot.getColor(), 0L);
        } else {
            Edge usedEdge = graph.getEdgeList().stream().filter(edge -> edge.getID().equals(leaderRotorRouterWithLeaderRobot.getLastUsedEdgeID()))
                    .collect(Collectors.toList()).get(0);

            List<Edge> edgeOptionOnTheNewRotorRouterWithLeaderNode = graph.getEdgeList().stream()
                    .filter(edge -> (edge.getFromID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) && edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor()))
                            || (edge.getToID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) && edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor())))
                    .collect(Collectors.toList());
            long firstPortIndex = 0L;
            for (Edge edge: edgeOptionOnTheNewRotorRouterWithLeaderNode) {
                if (edge.getID().equals(usedEdge.getID())){
                    currentRotorRouterWithLeaderNode.setCurrentComponentPointer(new HashMap<>());
                    currentRotorRouterWithLeaderNode.getCurrentComponentPointer().put(leaderRotorRouterWithLeaderRobot.getColor(), firstPortIndex);
                }
                firstPortIndex++;
            }
        }


    }
}
