package engine.algorithms.rotor_router_with_leader_dispersion;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import engine.algorithms.rotor_router_with_leader_dispersion.models.*;
import engine.algorithms.utils.LocalLeaderElection;
import engine.core.algorithms.RotorRouterWithLeaderDispersionManager;
import engine.core.models.Graph;
import engine.core.utils.NodeState;
import engine.core.utils.RobotState;

import static java.util.stream.Collectors.groupingBy;

import java.util.HashMap;

@Component
public class RotorRouterWithLeaderDispersionManagement implements
        RotorRouterWithLeaderDispersionManager<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot> {

    @Override
    public void step(Graph<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge> graph,
            List<RotorRouterWithLeaderDispersionRobot> robotList) {
        look(graph, robotList);
        compute(graph, robotList);
        move(graph, robotList);
    }

    private void look(Graph<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge> graph,
            List<RotorRouterWithLeaderDispersionRobot> robotList) {
        /*
         * Map<Long, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsOnDifferentRotorRouterWithLeaderNodes = robotList.stream()
         * .filter(robot -> !robot.getState().equals(RobotState.SETTLED))
         * .collect(groupingBy(RotorRouterWithLeaderDispersionRobot::getOnID));
         * 
         * for (Map.Entry<Long, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsByRotorRouterWithLeaderNode :
         * robotsOnDifferentRotorRouterWithLeaderNodes.entrySet()) {
         * 
         * Map<Color, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsGroupedByColorOnRotorRouterWithLeaderNode =
         * robotsByRotorRouterWithLeaderNode.getValue()
         * .stream().collect(groupingBy(RotorRouterWithLeaderDispersionRobot::getColor))
         * ;
         * 
         * for (Map.Entry<Color, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsByColor : robotsGroupedByColorOnRotorRouterWithLeaderNode.entrySet()) {
         * // There is at least two leader on this node
         * if (leaderCount(robotsByColor.getValue()) > 1) {
         * List<RotorRouterWithLeaderDispersionRobot>
         * currentLeadersInOneRotorRouterWithLeaderNode =
         * getCurrentLeaders(robotsByColor.getValue());
         * // Recalculate the winner leader
         * RotorRouterWithLeaderDispersionRobot winnerLeader = new
         * LocalLeaderElection<RotorRouterWithLeaderDispersionRobot>().run(
         * currentLeadersInOneRotorRouterWithLeaderNode);
         * for (RotorRouterWithLeaderDispersionRobot robot :
         * currentLeadersInOneRotorRouterWithLeaderNode){
         * // If there is more leader robot on one node, we set them back to explore
         * state
         * if (!robot.getID().equals(winnerLeader.getID())) {
         * robot.setState(RobotState.EXPLORE);
         * }
         * }
         * } else if (leaderCount(robotsByColor.getValue()) == 1) {
         * // System.out.println("We have one leader on node:" +
         * robotsByRotorRouterWithLeaderNode.getKey() + " with color: " +
         * robotsByColor.getKey());
         * } else { // => leader count = 0 => need to choose a new one
         * // System.out.println("new leader choosing is hapening!");
         * RotorRouterWithLeaderDispersionRobot winnerRotorRouterWithLeaderRobot = new
         * LocalLeaderElection<RotorRouterWithLeaderDispersionRobot>().run(robotsByColor
         * .getValue());
         * robotsByColor.getValue().forEach(robot ->
         * robot.setState(robot.getID().equals(winnerRotorRouterWithLeaderRobot.getID())
         * ? RobotState.LEADER : RobotState.EXPLORE));
         * }
         * }
         * }
         */
    }

    private void compute(Graph<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge> graph,
            List<RotorRouterWithLeaderDispersionRobot> robotList) {
        /*
         * Map<Long, List<RotorRouterWithLeaderDispersionRobot>>
         * leadersOnDifferentRotorRouterWithLeaderNodes = robotList.stream()
         * .filter(robot -> robot.getState().equals(RobotState.LEADER))
         * .collect(groupingBy(RotorRouterWithLeaderDispersionRobot::getOnID));
         * 
         * for (Map.Entry<Long, List<RotorRouterWithLeaderDispersionRobot>>
         * leadersByRotorRouterWithLeaderNode :
         * leadersOnDifferentRotorRouterWithLeaderNodes.entrySet()) {
         * 
         * if (isRotorRouterWithLeaderNodeOccupied(graph,
         * leadersByRotorRouterWithLeaderNode.getKey())) {
         * for (RotorRouterWithLeaderDispersionRobot leaderRotorRouterWithLeaderRobot:
         * leadersByRotorRouterWithLeaderNode.getValue()) {
         * 
         * //Check if the component still has some free nodes
         * if (isComponentOccupied(graph, leaderRotorRouterWithLeaderRobot.getColor()))
         * {
         * // Terminate the leader and his followers
         * robotList.stream().filter(robot ->
         * robot.getOnID().equals(leaderRotorRouterWithLeaderRobot.getOnID())
         * && !robot.getState().equals(RobotState.SETTLED))
         * .forEach(follower -> follower.setState(RobotState.TERMINATED));
         * }
         * 
         * // Need to find a new path
         * long newPath = getNewPath(graph, leaderRotorRouterWithLeaderRobot.getOnID(),
         * leaderRotorRouterWithLeaderRobot.getColor());
         * leaderRotorRouterWithLeaderRobot.setDestinationID(newPath);
         * 
         * RotorRouterWithLeaderDispersionEdge usedEdge = graph.getEdgeList().stream()
         * .filter(edge ->
         * (edge.getFromID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) &&
         * edge.getToID().equals(newPath) &&
         * edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor()))
         * ||
         * (edge.getToID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) &&
         * edge.getFromID().equals(newPath) &&
         * edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor()))
         * ).collect(Collectors.toList()).get(0);
         * leaderRotorRouterWithLeaderRobot.setLastUsedEdgeID(usedEdge.getID());
         * 
         * }
         * } else {
         * // Check if the leader is the only robot here and able to settle down
         * if (robotCountOnRotorRouterWithLeaderNode(robotList,
         * leadersByRotorRouterWithLeaderNode.getKey()) == 1) {
         * // Set the initial lastPort from where he came from
         * setTheFirstPortIndexOnRotorRouterWithLeaderNode(graph,
         * leadersByRotorRouterWithLeaderNode.getValue().get(0));
         * leadersByRotorRouterWithLeaderNode.getValue().get(0).setDestinationID(
         * leadersByRotorRouterWithLeaderNode.getKey()); // If the destination is the
         * same as the on id it will settle there
         * 
         * 
         * } else { // Check if any other group is here IN DIFFERENT COLOR and have
         * election together for settling down
         * List<RotorRouterWithLeaderDispersionRobot> followersInEveryColor =
         * robotList.stream()
         * .filter(robot -> robot.getState().equals(RobotState.EXPLORE) &&
         * robot.getOnID().equals(leadersByRotorRouterWithLeaderNode.getKey())).collect(
         * Collectors.toList());
         * 
         * // If 1 < leader without followers
         * if (followersInEveryColor.size() < 1) {
         * // The leaders have election for settling down
         * RotorRouterWithLeaderDispersionRobot winnerLeader = new
         * LocalLeaderElection<RotorRouterWithLeaderDispersionRobot>().run(
         * leadersByRotorRouterWithLeaderNode.getValue());
         * 
         * for (RotorRouterWithLeaderDispersionRobot leader :
         * leadersByRotorRouterWithLeaderNode.getValue()) {
         * if (leader.getID().equals(winnerLeader.getID())) {
         * 
         * // Set the initial lastPort from where he came from
         * setTheFirstPortIndexOnRotorRouterWithLeaderNode(graph, winnerLeader);
         * winnerLeader.setDestinationID(leadersByRotorRouterWithLeaderNode.getKey());
         * 
         * } else {
         * 
         * // Find a new path
         * long newPath = getNewPath(graph, leader.getOnID(), leader.getColor());
         * leader.setDestinationID(newPath);
         * 
         * RotorRouterWithLeaderDispersionEdge usedEdge = graph.getEdgeList().stream()
         * .filter(edge -> (edge.getFromID().equals(leader.getOnID()) &&
         * edge.getToID().equals(newPath) && edge.getColor().equals(leader.getColor()))
         * ||
         * (edge.getToID().equals(leader.getOnID()) &&
         * edge.getFromID().equals(newPath) &&
         * edge.getColor().equals(leader.getColor()))
         * ).collect(Collectors.toList()).get(0);
         * leader.setLastUsedEdgeID(usedEdge.getID());
         * }
         * }
         * } else {
         * // If 1 < leader and someone has followers
         * // Choose a random settler and every other robots move
         * 
         * RotorRouterWithLeaderDispersionRobot settlerFollower = new
         * LocalLeaderElection<RotorRouterWithLeaderDispersionRobot>().run(
         * followersInEveryColor);
         * 
         * // Find the leader of the settler
         * RotorRouterWithLeaderDispersionRobot leaderForSettler =
         * robotList.stream().filter(robot -> robot.getState().equals(RobotState.LEADER)
         * && robot.getOnID().equals(settlerFollower.getOnID()) &&
         * robot.getColor().equals(settlerFollower.getColor()))
         * .collect(Collectors.toList()).get(0);
         * 
         * setTheFirstPortIndexOnRotorRouterWithLeaderNode(graph, leaderForSettler);
         * 
         * settlerFollower.setDestinationID(leadersByRotorRouterWithLeaderNode.getKey())
         * ;
         * 
         * 
         * for (RotorRouterWithLeaderDispersionRobot otherLeader :
         * leadersByRotorRouterWithLeaderNode.getValue()) {
         * 
         * long newPath = getNewPath(graph, otherLeader.getOnID(),
         * otherLeader.getColor());
         * otherLeader.setDestinationID(newPath);
         * 
         * RotorRouterWithLeaderDispersionEdge usedEdge = graph.getEdgeList().stream()
         * .filter(edge -> (edge.getFromID().equals(otherLeader.getOnID()) &&
         * edge.getToID().equals(newPath) &&
         * edge.getColor().equals(otherLeader.getColor()))
         * ||
         * (edge.getToID().equals(otherLeader.getOnID()) &&
         * edge.getFromID().equals(newPath) &&
         * edge.getColor().equals(otherLeader.getColor()))
         * ).collect(Collectors.toList()).get(0);
         * otherLeader.setLastUsedEdgeID(usedEdge.getID());
         * 
         * }
         * }
         * }
         * }
         * }
         */
    }

    private void move(Graph<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge> graph,
            List<RotorRouterWithLeaderDispersionRobot> robotList) {
        // If a leader has different destinationID than his onID then he will move
        // otherwise settle
        // is a simple robot has a destination he will settle on that.
        /*
         * Map<Long, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsOnDifferentRotorRouterWithLeaderNodes = robotList.stream()
         * .filter(robot -> !robot.getState().equals(RobotState.SETTLED) &&
         * !robot.getState().equals(RobotState.TERMINATED))
         * .collect(groupingBy(RotorRouterWithLeaderDispersionRobot::getOnID));
         * 
         * for (Map.Entry<Long, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsByRotorRouterWithLeaderNode :
         * robotsOnDifferentRotorRouterWithLeaderNodes.entrySet()) {
         * 
         * Map<Color, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsGroupedByColorOnRotorRouterWithLeaderNode =
         * robotsByRotorRouterWithLeaderNode.getValue()
         * .stream().collect(groupingBy(RotorRouterWithLeaderDispersionRobot::getColor))
         * ;
         * 
         * for (Map.Entry<Color, List<RotorRouterWithLeaderDispersionRobot>>
         * robotsByColor : robotsGroupedByColorOnRotorRouterWithLeaderNode.entrySet()) {
         * RotorRouterWithLeaderDispersionRobot leader =
         * robotsByColor.getValue().stream().filter(robot ->
         * robot.getState().equals(RobotState.LEADER))
         * .collect(Collectors.toList()).get(0);
         * if (leader.getOnID().equals(leader.getDestinationID())) {
         * 
         * leader.setState(RobotState.SETTLED);
         * settleOnRotorRouterWithLeaderNode(leader.getOnID(), graph);
         * } else {
         * leader.setOnID(leader.getDestinationID());
         * for (RotorRouterWithLeaderDispersionRobot follower :
         * robotsByColor.getValue().stream().filter(robot ->
         * robot.getState().equals(RobotState.EXPLORE)).collect(Collectors.toList())) {
         * if (follower.getDestinationID() != null){
         * follower.setState(RobotState.SETTLED);
         * settleOnRotorRouterWithLeaderNode(follower.getOnID(), graph);
         * } else {
         * follower.setOnID(leader.getDestinationID());
         * }
         * }
         * // Set back to default after move
         * leader.setDestinationID(null);
         * }
         * }
         * 
         * }
         */
    }

    /*
     * private Long leaderCount(List<RotorRouterWithLeaderDispersionRobot>
     * robotList) {
     * return robotList.stream().filter(robot ->
     * robot.getState().equals(RobotState.LEADER)).count();
     * }
     * 
     * private Long robotCountOnRotorRouterWithLeaderNode(List<
     * RotorRouterWithLeaderDispersionRobot> robotList, Long nodeID) {
     * return robotList.stream().filter(robot ->
     * robot.getOnID().equals(nodeID)).count();
     * }
     * 
     * private List<RotorRouterWithLeaderDispersionRobot>
     * getCurrentLeaders(List<RotorRouterWithLeaderDispersionRobot> robotList) {
     * return robotList.stream().filter(robot ->
     * robot.getState().equals(RobotState.LEADER)).collect(Collectors.toList());
     * }
     * 
     * private boolean isRotorRouterWithLeaderNodeOccupied(Graph<
     * RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge>
     * graph, Long nodeID) {
     * for (RotorRouterWithLeaderDispersionNode node : graph.getNodeList()) {
     * if (node.getID() == nodeID && node.getState().equals(NodeState.OCCUPIED))
     * return true;
     * }
     * return false;
     * }
     * 
     * private Long getNewPath(Graph<RotorRouterWithLeaderDispersionNode,
     * RotorRouterWithLeaderDispersionEdge> graph, Long onID, Color color) {
     * List<Long> edgeOptions = graph.getEdgeList().stream()
     * .filter(edge -> (edge.getFromID().equals(onID) &&
     * edge.getColor().equals(color))
     * || (edge.getToID().equals(onID) && edge.getColor().equals(color)))
     * .map(edge -> edge.getToID().equals(onID) ? edge.getFromID() : edge.getToID())
     * .collect(Collectors.toList());
     * 
     * RotorRouterWithLeaderDispersionNode currentRotorRouterWithLeaderNode =
     * graph.getNodeList().stream().filter(node ->
     * node.getID().equals(onID)).collect(Collectors.toList()).get(0);
     * 
     * // If the current rotor portID < edge options size, we can choose the next
     * edge option
     * 
     * if (currentRotorRouterWithLeaderNode.getRotorRouter() == null) {
     * currentRotorRouterWithLeaderNode.setRotorRouter(new HashMap<>());
     * currentRotorRouterWithLeaderNode.getRotorRouter().put(color, 0L);
     * }
     * 
     * if (currentRotorRouterWithLeaderNode.getRotorRouter().get(color) == null) {
     * currentRotorRouterWithLeaderNode.getRotorRouter().put(color, 0L);
     * }
     * 
     * if (currentRotorRouterWithLeaderNode.getRotorRouter().get(color) <
     * edgeOptions.size() - 1) {
     * currentRotorRouterWithLeaderNode.getRotorRouter().put(color,
     * (currentRotorRouterWithLeaderNode.getRotorRouter().get(color) + 1));
     * } else if (edgeOptions.size() == 1){
     * // System.out.
     * println("There is no more new option, go on the only option we have");
     * } else if (edgeOptions.size() == 0) {
     * throw new
     * RuntimeException("Leader robot stepped into a trap on RotorRouterWithLeaderNode with ID "
     * + onID);
     * } else {
     * // If we already checked the all edge, we start from the 0 option!
     * // currentRotorRouterWithLeaderNode.setLastPortIndex(0L);
     * currentRotorRouterWithLeaderNode.getRotorRouter().put(color, 0L);
     * }
     * 
     * return
     * edgeOptions.get(currentRotorRouterWithLeaderNode.getRotorRouter().get(color).
     * intValue());
     * }
     * 
     * private void settleOnRotorRouterWithLeaderNode(Long nodeID,
     * Graph<RotorRouterWithLeaderDispersionNode,
     * RotorRouterWithLeaderDispersionEdge> graph) {
     * for (RotorRouterWithLeaderDispersionNode node : graph.getNodeList()) {
     * if (node.getID().equals(nodeID)) {
     * node.setState(NodeState.OCCUPIED);
     * }
     * }
     * }
     * 
     * private void setTheFirstPortIndexOnRotorRouterWithLeaderNode(Graph<
     * RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge>
     * graph, RotorRouterWithLeaderDispersionRobot leaderRotorRouterWithLeaderRobot)
     * {
     * RotorRouterWithLeaderDispersionNode currentRotorRouterWithLeaderNode =
     * graph.getNodeList().stream()
     * .filter(node ->
     * node.getID().equals(leaderRotorRouterWithLeaderRobot.getOnID())).collect(
     * Collectors.toList()).get(0);
     * 
     * if (leaderRotorRouterWithLeaderRobot.getLastUsedEdgeID() == null) {
     * 
     * currentRotorRouterWithLeaderNode.setRotorRouter(new HashMap<>());
     * currentRotorRouterWithLeaderNode.getRotorRouter().put(
     * leaderRotorRouterWithLeaderRobot.getColor(), 0L);
     * } else {
     * RotorRouterWithLeaderDispersionEdge usedEdge =
     * graph.getEdgeList().stream().filter(edge ->
     * edge.getID().equals(leaderRotorRouterWithLeaderRobot.getLastUsedEdgeID()))
     * .collect(Collectors.toList()).get(0);
     * 
     * List<RotorRouterWithLeaderDispersionEdge>
     * edgeOptionOnTheNewRotorRouterWithLeaderNode = graph.getEdgeList().stream()
     * .filter(edge ->
     * (edge.getFromID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) &&
     * edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor()))
     * || (edge.getToID().equals(leaderRotorRouterWithLeaderRobot.getOnID()) &&
     * edge.getColor().equals(leaderRotorRouterWithLeaderRobot.getColor())))
     * .collect(Collectors.toList());
     * long firstPortIndex = 0L;
     * for (RotorRouterWithLeaderDispersionEdge edge:
     * edgeOptionOnTheNewRotorRouterWithLeaderNode) {
     * if (edge.getID().equals(usedEdge.getID())){
     * currentRotorRouterWithLeaderNode.setRotorRouter(new HashMap<>());
     * currentRotorRouterWithLeaderNode.getRotorRouter().put(
     * leaderRotorRouterWithLeaderRobot.getColor(), firstPortIndex);
     * }
     * firstPortIndex++;
     * }
     * }
     * }
     * 
     * private boolean
     * isComponentOccupied(Graph<RotorRouterWithLeaderDispersionNode,
     * RotorRouterWithLeaderDispersionEdge> graph, Color component) {
     * List<RotorRouterWithLeaderDispersionEdge> componentEdges =
     * graph.getEdgeList().stream().filter(edge ->
     * edge.getColor().equals(component)).collect(Collectors.toList());
     * 
     * List<Long> fromIDs =
     * componentEdges.stream().map(RotorRouterWithLeaderDispersionEdge::getFromID).
     * collect(Collectors.toList());
     * List<Long> toIDs =
     * componentEdges.stream().map(RotorRouterWithLeaderDispersionEdge::getToID).
     * collect(Collectors.toList());
     * fromIDs.addAll(toIDs);
     * 
     * List<Long> componentNodeIDs =
     * fromIDs.stream().distinct().collect(Collectors.toList());
     * List<RotorRouterWithLeaderDispersionNode> componentNodes = new ArrayList<>();
     * for (Long ID : componentNodeIDs) {
     * componentNodes.add(graph.getNodeList().stream().filter(node ->
     * node.getID().equals(ID)).findAny().orElseThrow(() -> new
     * RuntimeException("Node with ID " + ID + " not found!")));
     * }
     * 
     * return componentNodes.size() == componentNodes.stream().filter(node ->
     * node.getState().equals(NodeState.OCCUPIED)).count();
     * }
     */
}
