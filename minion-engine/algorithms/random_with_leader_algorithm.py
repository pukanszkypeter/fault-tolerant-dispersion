from random import randint
from algorithms.model import *
from logger.logger import *

def test(json):
    steps = run(SimulationState(json['simulationState']))
    result = Logger({
        'algorithmType': json['algorithmType'], 
        'graphType': json['graphType'], 
        'nodes': json['nodes'], 
        'robots': json['robots'], 
        'components': json['components'], 
        'steps': steps
        }).log()
    return steps if result else None

def run(simulationState):
    steps = 0
    while simulationState.counter != 0:
        simulationState = step(simulationState)
        steps += 1

    return steps

def step(simulationState):
    # L
    look(simulationState)
    # C
    compute(simulationState)
    # M
    move(simulationState)

    return simulationState

def look(simulationState):

    if not allColorHasLeader(simulationState):
        alreadyHasLeader = False
        for robot in simulationState.robots:
            if robot.state == RobotState.SEARCHING:
                currentNode = simulationState.getNode(robot.onID)
                if currentNode.state != NodeState.OCCUPIED:
                    robot.state = RobotState.LEADER
            elif robot.state == RobotState.LEADER:
                alreadyHasLeader = True

        if not alreadyHasLeader:
            leaderElection(simulationState.robots)

def compute(simulationState):
    # case: more robots on one node
    leaders = list(filter(lambda x: x.state == RobotState.LEADER, simulationState.robots))
    for robot in leaders:
            options = simulationState.getEdgeOptions(robot, True)
            random = randint(0, len(options) - 1)

            robot.destinationID = options[random]
            #If there is no one who can settle down, the leader will

            robotsOnNode = list(filter(lambda x: (x.state == RobotState.SEARCHING or x.state == RobotState.SETLER) and x.onID == robot.onID and x.color == robot.color, simulationState.robots))
            if len(robotsOnNode) == 0:
                if simulationState.getNode(robot.onID).state != NodeState.OCCUPIED:
                    robot.destinationID = robot.onID
                    robot.state = RobotState.SETLER

    for node in simulationState.nodes:
        robotsHere = list(filter(lambda x: x.onID == node.id, simulationState.robots))
        colors = set(list(map(lambda x: x.color, robotsHere)))
        if len(colors) > 0:
            gotMessias = False
            for color in colors:
                messiah = list(filter(lambda x: x.state == RobotState.SEARCHING and x.onID == node.id and x.color == color, simulationState.robots))
                if len(messiah) > 0:
                    otherRobots = list(filter(lambda x: x.state == RobotState.SEARCHING and x.onID == node.id and x.color == color, simulationState.robots))
                    if not gotMessias:
                        if simulationState.getNode(node.id).state != NodeState.OCCUPIED:
                            messiah[0].destinationID = node.id
                            messiah[0].state = RobotState.SETLER
                            gotMessias = True
                    if not gotMessias:
                        if simulationState.getNode(node.id).state != NodeState.OCCUPIED:
                            otherRobots = list(filter(lambda x: x.state == RobotState.SEARCHING and x.onID == node.id and x.color == color and x.id != messiah[0].id, simulationState.robots))

                    leaderForThatColor = list(filter(lambda x: x.color == color and x.state == RobotState.LEADER and x.onID == node.id, simulationState.robots))
                    if len(leaderForThatColor) > 0:
                        if len(leaderForThatColor) > 1:
                            #select only one leader
                            randomNum = randint(0, len(leaderForThatColor) - 1)
                            choosenLeader = leaderForThatColor[randomNum]
                            for j in leaderForThatColor:
                                if j.id != choosenLeader.id:
                                    j.state = RobotState.SEARCHING
                                    leaderForThatColor.remove(j)
                                    otherRobots.append(j)
                        for rob in otherRobots:
                            rob.destinationID = simulationState.getRobot(leaderForThatColor[0].id).destinationID

def move(simulationState):
    for robot in simulationState.robots:

        if robot.state == RobotState.SETLER:
            currentNode = simulationState.getNode(robot.onID)
            currentNode.state = NodeState.OCCUPIED
            robot.state = RobotState.FINISHED
            simulationState.counter -= 1

        elif robot.state != RobotState.FINISHED:
            robot.onID = robot.destinationID
            nextNode = simulationState.getNode(robot.onID)
            if nextNode.state != NodeState.OCCUPIED:
                nextNode.state = NodeState.PENDING

def leaderElection(robots):
    #Minden színhez kell külön leader
    colors = set(list(map(lambda x: x.color, robots)))
    for color in colors:
        robs = list(filter(lambda x: x.color == color, robots))
        for robot in robs:
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

def allColorHasLeader(simulationState):
    colors = set(list(map(lambda x: x.color, simulationState.robots)))
    counter = 0
    for color in colors:
        robotsWithThatColorL = list(filter(lambda x: x.color == color and x.state == RobotState.LEADER, simulationState.robots))
        robotsWithThatColorS = list(filter(lambda x: x.color == color and x.state == RobotState.SEARCHING, simulationState.robots))
        if len(robotsWithThatColorS) > 0 and len(robotsWithThatColorL) > 0:
            counter += 1
        elif len(robotsWithThatColorS) == 0 and len(robotsWithThatColorL) > 0:
            counter += 1
        else:
            counter -= 1
    if counter != len(colors):
        return False
    else:
        return True