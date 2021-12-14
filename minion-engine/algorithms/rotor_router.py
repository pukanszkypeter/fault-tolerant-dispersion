from random import randint
from algorithms.model import *

def rotorRouterStep(simulationState):
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
            options = simulationState.getEdgeOptionsWithRotor(robot)
            if len(options) > 0:
                random = randint(0, len(options) - 1)
            robot.destinationID = options[random] if len(options) > 0 else robot.onID

def move(simulationState):
    for robot in simulationState.robots:
        if robot.state == RobotState.LEADER:
            currentNode = simulationState.getNode(robot.onID)
            currentNode.state = NodeState.OCCUPIED
            robot.state = RobotState.FINISHED
            simulationState.counter -= 1

        elif robot.state == RobotState.SEARCHING:
            robot.onID = robot.destinationID
            setledRobot = list(filter(lambda x: x.onID == robot.destinationID, simulationState.robots))
            if len(setledRobot) > 0:
                simulationState.robots[simulationState.robots.index(setledRobot[0])].lastEdgeID = robot.destinationID
            nextNode = simulationState.getNode(robot.onID)
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
