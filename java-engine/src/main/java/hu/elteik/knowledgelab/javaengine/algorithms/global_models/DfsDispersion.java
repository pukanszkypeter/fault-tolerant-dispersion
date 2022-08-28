package hu.elteik.knowledgelab.javaengine.algorithms.global_models;

import java.util.List;
import java.util.stream.Collectors;

import hu.elteik.knowledgelab.javaengine.core.global_models.*;
import hu.elteik.knowledgelab.javaengine.core.models.Color;
import hu.elteik.knowledgelab.javaengine.core.models.NodeState;
import hu.elteik.knowledgelab.javaengine.core.models.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.RobotState;


public class DfsDispersion {

    public static void main(String[] args) {

        System.out.println("TESTING...");

        GlobalGraph graph = new GlobalGraph(
                List.of(
                        new GlobalNode(1L, NodeState.DEFAULT),
                        new GlobalNode(2L, NodeState.DEFAULT),
                        new GlobalNode(3L, NodeState.DEFAULT),
                        new GlobalNode(4L, NodeState.DEFAULT)
                ),
                List.of(
                        new GlobalEdge(1L, 1L, 2L, Color.BLACK),
                        new GlobalEdge(2L, 2L, 3L, Color.BLACK),
                        new GlobalEdge(3L, 2L, 4L, Color.BLACK)
                )
        );

        List<GlobalRobot> robotList = List.of(
                new GlobalRobot(1L, RobotState.START, Color.BLACK, 1L, 0L, 0L, 0L),
                new GlobalRobot(2L, RobotState.START, Color.BLACK, 1L, 0L, 0L, 0L),
                new GlobalRobot(3L, RobotState.START, Color.BLACK, 1L, 0L, 0L, 0L),
                new GlobalRobot(4L, RobotState.START, Color.BLACK, 1L, 0L, 0L, 0L)
        );

        step(graph, robotList);
    }
    
    public static void step(GlobalGraph graph, List<GlobalRobot> robotList) {

        // Phase 1

        List<GlobalRobot> activeRobots = robotList.stream().filter(r -> r.getState().equals(RobotState.START) || r.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList());
        GlobalRobot leader = activeRobots.get(activeRobots.size() - 1);

        long tempChildID = leader.getChildID();
        if (leader.getState().equals(RobotState.START)) {

            leader.setChildID(1L);
            leader.setParentID(0L);
            leader.setState(RobotState.LEADER);

        } else if (leader.getState().equals(RobotState.EXPLORE)) {
            GlobalNode currentNode = graph.getNodeList().stream()
                        .filter(node -> node.getID().equals(leader.getOnID()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("Node with ID " + leader.getOnID() + " not found!"));

            if (!currentNode.getState().equals(NodeState.OCCUPIED)) {
                List<GlobalEdge> edges = graph.getEdgeList().stream().filter(e -> e.getToID().equals(leader.getOnID()) || e.getFromID().equals(leader.getOnID())).collect(Collectors.toList());
                leader.setParentID((long) edges.indexOf(graph.getEdgeList().stream().filter(e -> e.getID() == leader.getLastUsedEdgeID()).collect(Collectors.toList()).get(0)) + 1);
                if (leader.getChildID() <= edges.size()) {
                    if ((leader.getChildID() + 1) != leader.getParentID() && (leader.getChildID() + 1) <= edges.size()) {
                        leader.setChildID(leader.getChildID() + 1);
                    } else {
                        leader.setChildID(leader.getChildID() + 2);
                    }
                }
                leader.setState(RobotState.LEADER);
            }

        }

        // Phase 2

        List<GlobalRobot> activeRobotsWithoutLeader = robotList.stream().filter(r -> r.getState().equals(RobotState.START) || r.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList());

        for (GlobalRobot robot : activeRobotsWithoutLeader) {
            if (robot.getState().equals(RobotState.START)) {
                
            } else if (robot.getState().equals(RobotState.EXPLORE)) {

            }
        }
        

        /*
        long lastChildID = 0L;

        // COMMUNICATE
        for (GlobalRobot robot : robotList) {
            long activeRobots = robotList.stream().filter(x -> x.getState().equals(RobotState.EXPLORE) || x.getState().equals(RobotState.START)).count();
            if (robot.getID() == activeRobots) {
                lastChildID = robot.getChildID();
                if (robot.getState().equals(RobotState.START)) {
                    robot.setChildID(1L);
                    robot.setParentID(0L);
                    robot.setState(RobotState.LEADER);
                } else if (robot.getState().equals(RobotState.EXPLORE)) {
                    List<GlobalEdge> edges = graph.getEdgeList().stream().filter(e -> e.getToID().equals(robot.getOnID()) || e.getFromID().equals(robot.getOnID())).collect(Collectors.toList());
                    robot.setParentID((long) edges.indexOf(graph.getEdgeList().stream().filter(e -> e.getID() == robot.getLastUsedEdgeID()).collect(Collectors.toList()).get(0)) + 1);
                    if (robot.getChildID() <= edges.size()) {
                        if ((robot.getChildID() + 1) != robot.getParentID() && (robot.getChildID() + 1) <= edges.size()) {
                            robot.setChildID(robot.getChildID() + 1);
                        } else {
                            robot.setChildID(robot.getChildID() + 2);
                        }
                    }
                    robot.setState(RobotState.LEADER);
                }
            }
        }

        // COMPUTE
        for (GlobalRobot robot : robotList) {
            if (robot.getState().equals(RobotState.EXPLORE)) {
                List<GlobalEdge> edges = graph.getEdgeList().stream().filter(e -> e.getToID().equals(robot.getOnID()) || e.getFromID().equals(robot.getOnID())).collect(Collectors.toList());
                GlobalRobot leader = robotList.stream().filter(r -> r.getState().equals(RobotState.LEADER)).collect(Collectors.toList()).get(0);
                
                if ((edges.size() == leader.getParentID() || edges.size() == lastChildID) && ()) {

                } else if ((edges.size() == leader.getParentID() || edges.size() == lastChildID) && ()) {

                }
            } else if (robot.getState.equals(RobotState.START)) {
                List<GlobalEdge> edges = graph.getEdgeList().stream().filter(e -> e.getToID().equals(robot.getOnID()) || e.getFromID().equals(robot.getOnID())).collect(Collectors.toList());
                GlobalRobot leader = robotList.stream().filter(r -> r.getState().equals(RobotState.LEADER)).collect(Collectors.toList()).get(0);

                if ((0L == leader.getParentID() || edges.size() == lastChildID) && (edges.size() >= leader.getChildID())) {
                    robot.setState(RobotState.EXPLORE);
                    robot.set
                }
            }
        }

        // MOVE
        for (GlobalRobot robot : robotList) {

        }
        */
    }

}
