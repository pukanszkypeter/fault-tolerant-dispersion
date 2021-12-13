from random import randint
from algorithms.model import *

def runRandomWithLeader(simulationState):
    steps = 0
    while simulationState.counter != 0:
        simulationState = stepRandomWithLeader(simulationState)
        steps += 1

    return {'steps': steps}

def stepRandomWithLeader(simulationState):
    # L
    look(simulationState)
    # C
    compute(simulationState)
    # M
    move(simulationState)

    return simulationState

def look(simulationState):
    for robot in simulationState.robots:
        if robot.state == RobotState.SEARCHING:
            currentNode = simulationState.getNode(robot.onID)
            if currentNode.state != NodeState.OCCUPIED:
                robot.state = RobotState.LEADER

def compute(simulationState):
    # case: more robots on one node
    leaderElection(simulationState.robots)

    for robot in simulationState.robots:
        if robot.state == RobotState.LEADER:
            robot.destinationID = robot.onID
        elif robot.state == RobotState.SEARCHING:
            # a person who carries them on
            messiah = list(filter(lambda x: x.state == RobotState.SEARCHING and x.onID == robot.onID and x.destinationID != 0, simulationState.robots))
            if len(messiah) > 0:
                robot.destinationID = messiah[0].destinationID
            else:
                options = simulationState.getEdgeOptions(robot, True)
                random = randint(0, len(options) - 1)
                robot.destinationID = options[random]

def move(simulationState):
    for robot in simulationState.robots:
        if robot.state == RobotState.LEADER:
            currentNode = simulationState.getNode(robot.onID)
            currentNode.state = NodeState.OCCUPIED
            robot.state = RobotState.FINISHED
            simulationState.counter -= 1

        elif robot.state == RobotState.SEARCHING:
            robot.onID = robot.destinationID
            robot.destinationID = 0 # should clear for new messiah
            nextNode = simulationState.getNode(robot.onID)
            if nextNode.state != NodeState.OCCUPIED:
                nextNode.state = NodeState.PENDING

def leaderElection(robots):
    for robot in robots:
        if robot.state == RobotState.LEADER:
            nominees = list(filter(lambda x: x.state == RobotState.LEADER and x.onID == robot.onID and x.color == robot.color, robots))
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

