from random import randint
from model import *

def runRandom(graphState):
    steps = 0
    while graphState.counter != 0:
        graphState = stepRandom(graphState)
        steps += 1

    return {'steps': steps}

def stepRandom(graphState):
    # L
    look(graphState)
    # C
    compute(graphState)
    # M
    move(graphState)

    return graphState

def look(graphState):
    for robot in graphState.robots:
        if robot.state == RobotState.SEARCHING:
            currentNode = graphState.getNode(robot.onID)
            if currentNode.state != NodeState.OCCUPIED:
                robot.state = RobotState.LEADER

def compute(graphState):
    # case: more robots on one node
    leaderElection(graphState.robots)

    for robot in graphState.robots:
        if robot.state == RobotState.LEADER:
            robot.destinationID = robot.onID
        elif robot.state == RobotState.SEARCHING:
            options = graphState.getEdgeOptions(robot, GraphState.COLOR_CONSTRAINT)
            if len(options) > 0:
                random = randint(0, len(options) - 1)
            robot.destinationID = options[random] if len(options) > 0 else robot.onID

def move(graphState):
    for robot in graphState.robots:
        if robot.state == RobotState.LEADER:
            currentNode = graphState.getNode(robot.onID)
            currentNode.state = NodeState.OCCUPIED
            robot.state = RobotState.FINISHED
            graphState.counter -= 1

        elif robot.state == RobotState.SEARCHING:
            robot.onID = robot.destinationID
            nextNode = graphState.getNode(robot.onID)
            if nextNode.state != NodeState.OCCUPIED:
                nextNode.state = NodeState.PENDING

def leaderElection(robots):
    for robot in robots:
        if robot.state == RobotState.LEADER:
            nominees = list(filter(lambda x: x.state == RobotState.LEADER and x.onID == robot.onID, robots))
            if len(nominees) > 1:
                leader = localLeaderElection(nominees)
                nominees.remove(leader)
                for nominee in nominees:
                    nominee.state = RobotState.SEARCHING

def localLeaderElection(candidates):
    if len(candidates) == 0:
        raise ValueError("Can not elect leader with 0 candidates!")
    
    elif len(candidates) == 1:
        return candidates[0]
    
    else:
        nominees = []
        for candidate in candidates:
            vote = randint(0, 1)
            if vote == 1:
                nominees.append(candidate)
        return localLeaderElection(nominees) if len(nominees) > 0 else localLeaderElection(candidates)

"""
# EXAMPLE

nodes = [Node(1, NodeState.PENDING), Node(2, NodeState.DEFAULT), 
        Node(3, NodeState.DEFAULT), Node(4, NodeState.DEFAULT), Node(5, NodeState.DEFAULT)]

edges = [Edge(1, 1, 2, 'red'), Edge(2, 1, 3, 'red'), Edge(3, 1, 4, 'red'), Edge(4, 1, 5, 'red'),
        Edge(5, 2, 3, 'red'), Edge(6, 2, 4, 'blue'), Edge(7, 2, 5, 'blue'),
        Edge(8, 3, 4, 'blue'), Edge(9, 3, 5, 'blue'),
        Edge(10, 4, 5, 'blue')]

robots = [Robot(1, 1, RobotState.SEARCHING, 'red'), Robot(2, 1, RobotState.SEARCHING, 'red'),
        Robot(3, 1, RobotState.SEARCHING, 'red'), Robot(4, 1, RobotState.SEARCHING, 'red'),
        Robot(5, 1, RobotState.SEARCHING, 'blue')]

graphState = GraphState(nodes, edges, robots)

print(runRandom(graphState))
"""