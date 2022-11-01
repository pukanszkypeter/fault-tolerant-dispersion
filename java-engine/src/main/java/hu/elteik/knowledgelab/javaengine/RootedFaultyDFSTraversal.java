package hu.elteik.knowledgelab.javaengine;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class RootedFaultyDFSTraversal {
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Node {
        private Character ID;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Edge {
        private int ID;
        private Character fromID;
        private Character toID;
        private int fromPort;
        private int toPort;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Graph {
        private List<Node> nodeList;
        private List<Edge> edgeList;
    }

    public static enum Phase {
        FORWARD,
        BACKTRACK
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Robot {
        private int ID;
        private Character onID;
        private int parent;
        private int child;
        private int lastUsedPort;
        private Phase phase;
        private int treelabel;
        private boolean settled;
        private boolean crashed;
    }

    public static void main(String[] args) {
        Graph graph = new Graph(
            Arrays.asList(
                new Node('X'), 
                new Node('Y'), 
                new Node('Z'), 
                new Node('W'), 
                new Node('A'), 
                new Node('B'), 
                new Node('C'), 
                new Node('D'), 
                new Node('E'),
                new Node('F'),
                new Node('G')
            ),
            Arrays.asList(
                new Edge(1, 'X', 'W', 1, 2),
                new Edge(2, 'X', 'Y', 2, 1), 
                new Edge(3, 'Y', 'Z', 2, 1), 
                new Edge(4, 'W', 'A', 1, 2), 
                new Edge(5, 'A', 'B', 1, 2), 
                new Edge(6, 'B', 'C', 1, 2), 
                new Edge(7, 'C', 'D', 1, 2), 
                new Edge(8, 'D', 'A', 1, 3), 
                new Edge(9, 'C', 'E', 3, 1), 
                new Edge(10, 'E', 'F', 2, 1),
                new Edge(11, 'A', 'G', 4, 1)
            )
        );

        List<Robot> robots = Arrays.asList(
            new Robot(1, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(2, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(3, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(4, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(5, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(6, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(7, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(8, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(9, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(10, 'X', 0, 0, 0, null, 0, false, false),
            new Robot(11, 'X', 0, 0, 0, null, 0, false, false)
        );

        int step = 1;

        while ( robots.stream().filter(robot -> robot.isSettled() || robot.isCrashed()).count() != robots.size() ) {

            System.out.print("Step " + step + ": ");

            // Crashes
            // if (step == 4) { robots.get(8).setCrashed(true); }

            List<Robot> activeRobots = robots.stream().filter(robot -> !robot.isSettled() && !robot.isCrashed()).collect(Collectors.toList());
            List<Robot> inactiveRobots = robots.stream().filter(robot -> robot.isSettled() && !robot.isCrashed()).collect(Collectors.toList());

            Node currentNode = graph.getNodeList().stream().filter(node -> node.getID().equals(activeRobots.get(0).getOnID())).findAny().orElse(null);
            List<Edge> currentEdges = graph.getEdgeList().stream().filter(edge -> currentNode.getID().equals(edge.getFromID()) || currentNode.getID().equals(edge.getToID())).collect(Collectors.toList());

            // COMMUNICATE
            boolean isCurrentNodeOccupied = inactiveRobots.stream().map(robot -> robot.getOnID()).collect(Collectors.toList()).contains(currentNode.getID());
            Robot router;

            if (!isCurrentNodeOccupied) {
                router = activeRobots.get(activeRobots.size() - 1);
                router.setSettled(true);
                router.setParent(router.getLastUsedPort());
                // -> Round 1
                if (router.getLastUsedPort() == 0) {
                    activeRobots.stream().forEach(robot -> robot.setTreelabel(router.getID()));
                }
                System.out.print(router.getOnID() + " node IS occupied by robot " + router.getID() + " with label " + router.getTreelabel());
            } else {
                Robot occupier = inactiveRobots.stream().filter(robot -> robot.getOnID().equals(currentNode.getID())).findAny().orElse(null);
                router = occupier;

                Robot lastRobot = activeRobots.get(activeRobots.size() - 1);
                // -> Forward fault
                // Should be the recalibration condition and run a fully new DFS with higher override priority
                if (
                        lastRobot.getPhase().equals(Phase.FORWARD) 
                    &&
                        lastRobot.getTreelabel() == router.getTreelabel()
                    &&
                            (router.getParent() == lastRobot.getLastUsedPort() 
                        || 
                            router.getChild() == lastRobot.getLastUsedPort())) {
                                router.setParent(lastRobot.getLastUsedPort());
                                router.setChild(0);
                                router.setTreelabel(lastRobot.getID());
                                activeRobots.stream().forEach(robot -> robot.setTreelabel(lastRobot.getID()));
                }
                if (lastRobot.getTreelabel() < router.getTreelabel()) {
                    router.setParent(lastRobot.getParent());
                    router.setChild(0);
                    router.setTreelabel(lastRobot.getTreelabel());
                }
                System.out.print(router.getOnID() + " node WAS occupied by robot " + router.getID() + " with label " + router.getTreelabel());
            }

            // COMPUTE
            int nodeDegree = (int) currentEdges.stream().count();

            if (router.getChild() <= nodeDegree) {
                if (router.getChild() + 1 != router.getParent()) {
                    router.setChild(router.getChild() + 1);
                } else {
                    router.setChild(router.getChild() + 2);
                }
            }
            
            Edge travelEdge = currentEdges
                .stream()
                .filter(edge -> edge.getFromID().equals(currentNode.getID()) ? edge.getFromPort() == router.getChild() : edge.getToPort() == router.getChild())
                .findAny()          // -> FORWARD PHASE
                .orElseGet(() -> {  // -> BACKTRACK PHASE
                    return currentEdges
                        .stream()
                        .filter(edge -> edge.getFromID().equals(currentNode.getID()) ? edge.getFromPort() == router.getParent() : edge.getToPort() == router.getParent())
                        .findAny()
                        .orElse(null);
                });
            
            // MOVE
            List<Robot> travelers = robots.stream().filter(robot -> !robot.isSettled() && !robot.isCrashed()).collect(Collectors.toList());
            int exitPort = travelEdge.getFromID().equals(currentNode.getID()) ? travelEdge.getFromPort() : travelEdge.getToPort();

            for (int i = 0; i < travelers.size(); i++) {
                travelers.get(i).setOnID(
                    travelEdge.getFromPort() == exitPort ? travelEdge.getToID() : travelEdge.getFromID()
                );
                travelers.get(i).setLastUsedPort(
                    travelEdge.getFromPort() == exitPort ? travelEdge.getToPort() : travelEdge.getFromPort()
                );
                travelers.get(i).setPhase(
                    router.getParent() == exitPort ? Phase.BACKTRACK : Phase.FORWARD
                );
            }

            // UTILS
            System.out.println(
                exitPort == router.getParent() ? 
                    " and active robots move (BACKWARD) through " + exitPort + "."
                : 
                    " and active robots move (FORWARD) through " + exitPort + ".");

            try {
                step++;
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
