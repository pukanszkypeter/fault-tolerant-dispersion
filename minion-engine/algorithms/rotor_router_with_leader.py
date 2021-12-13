# POWERED BY BENCUS
import random
from algorithms.model import *



def look(robot, simulationState):
    if simulationState.colorsWithLeader is None:
        simulationState = chooseLeaderRobot(simulationState)

    # Szét nézünk hogy mik az opciók ha a robot még nem finishelt
    if robot.state != RobotState.FINISHED:
        #CurrentNode
        node = list(filter(lambda x: robot.onID == x.id, simulationState.nodes))
        if len(node) > 0:
            #Ha két robot leaderes csapat össsze találkozik akkor egyből közös vezetőt választanak

            node = node[0]
            otherLeadersOnThisNode = []
            for j in simulationState.colorsWithLeader:
                for ldRobot in j.leaders:
                    robots = list(filter(lambda x: node.id == x.onID and x.id == ldRobot, simulationState.robots))
                    if len(robots) > 0:
                        otherLeadersOnThisNode.append(robots[0])

                if len(otherLeadersOnThisNode) > 0:
                    otherLeadersOnThisNode.append(robot)
                    chosenLeader = otherLeadersOnThisNode[random.randint(0, len(otherLeadersOnThisNode)-1)]
                    simulationState.colorsWithLeader[simulationState.colorsWithLeader.index(j)].leaders = []
                    simulationState.colorsWithLeader[simulationState.colorsWithLeader.index(j)].leaders.append(chosenLeader.id)


            robotsOnTheNodeWithLeader = list(filter(lambda x: x.color == robot.color and x.id != robot.id and x.state != RobotState.FINISHED, simulationState.robots))

            #Ha minden őt k9övető robot letelepedett akkor letepelszik ő is.
            if len(robotsOnTheNodeWithLeader) == 0 and node.state != NodeState.OCCUPIED:
                simulationState.robots[simulationState.robots.index(robot)].options = None
            else:

                if node.state != NodeState.OCCUPIED:
                    chosenLeader = robotsOnTheNodeWithLeader[random.randint(0, len(robotsOnTheNodeWithLeader)-1)]
                    simulationState.robots[simulationState.robots.index(chosenLeader)].options = None

                options = list(map(lambda x: x.fromID if node.id == x.toID else x.toID,
                                   list(filter(lambda x: (x.color == robot.color) and (x.toID == node.id or x.fromID == node.id), simulationState.edges))))

                if len(options) > 1:
                    # Megnézzük, ha van robot a jelenlegi node-on akkor kizárjuk a lastEdgeId lehetőséget.
                    setledRobotAtCurrentNode = list(filter(lambda x: x.onID == node.id, simulationState.robots))
                    if len(setledRobotAtCurrentNode) > 0:
                        options = list(filter(lambda x: x != setledRobotAtCurrentNode[0].lastEdgeId, options))
                robot.options = list(options)

    return robot

def compute(robot):
    # Vesszük a robot optionjait és kiválasztunk csak 1-t.
    if robot.options is not None:
        if robot.state != RobotState.FINISHED and len(robot.options) > 0:
            chosenRote = robot.options[random.randint(0, len(robot.options)-1)]
            robot.options = [chosenRote]
    return robot

def move(robot, simulationState):
    if robot.state != RobotState.FINISHED:
        node = list(filter(lambda x: robot.onID == x.id, simulationState.nodes))[0]

        setledRobot = list(filter(lambda x: x.state == RobotState.FINISHED and x.onID == robot.onID , simulationState.robots))
        if len(setledRobot) > 0:
            simulationState.robots[simulationState.robots.index(setledRobot[0])].lastEdgeId = robot.options[0]

        if robot.options is None:
            simulationState.robots[simulationState.robots.index(robot)].state = RobotState.FINISHED
            simulationState.nodes[simulationState.nodes.index(node)].state = NodeState.OCCUPIED
            simulationState.counter -= 1
        else:
            robot.onID = robot.options[0]

        #Tobbi robot koveti a vezetot
        for i in simulationState.robots:
            if i.color == robot.color and i.state != RobotState.FINISHED and i.options is not None:
                simulationState.robots[simulationState.robots.index(i)].onID = robot.onID
            if i.color == robot.color and i.state != RobotState.FINISHED and i.options is None:
                simulationState.robots[simulationState.robots.index(i)].state = RobotState.FINISHED
                simulationState.nodes[simulationState.nodes.index(node)].state = NodeState.OCCUPIED
                simulationState.counter -= 1

    return robot

def chooseLeaderRobot(simulationState):
    ##init
    leaderRobots = list(filter(lambda x: x.state == RobotState.LEADER, simulationState.robots))
    simulationState.colorsWithLeader = []
    if len(leaderRobots) == 0:
        colors = set(list(map(lambda x: x.color, simulationState.robots)))
        for i in colors:
            colorWithLeader = ColorWithLeader(i)
            for node in simulationState.nodes:
                robots = list(filter(lambda x: x.color == i and x.onID == node.id and x.state != RobotState.FINISHED, simulationState.robots))

                if len(robots) > 0:
                    randomRobot = random.randint(0, len(robots)-1)
                    robots[randomRobot].state = RobotState.LEADER
                    robotId = robots[randomRobot].id
                    colorWithLeader.leaders.append(robotId)

            simulationState.colorsWithLeader.append(colorWithLeader)
    else:
        colors = set(list(map(lambda x: x.color, leaderRobots)))
        for i in colors:
            colorWithLeader = ColorWithLeader(i)
            robots = list(filter(lambda x: x.color == i and x.state != RobotState.FINISHED, leaderRobots))
            for j in robots:
                colorWithLeader.leaders.append(j.id)
            simulationState.colorsWithLeader.append(colorWithLeader)
    return simulationState

def rotorRouterWithLeaderPlay(simulationState):
    steps = 0
    while not isAllNodeOccupied(simulationState.counter):
        simulationState = rotorRouterWithLeaderStep(simulationState)
        steps += 1
    return steps


def rotorRouterWithLeaderStep(simulationState):

    for leaderRobots in simulationState.colorsWithLeader:
        for ldRobot in leaderRobots.leaders:
            robot = list(filter(lambda x: x.id == ldRobot, simulationState.robots))[0]
            simulationState.robots[simulationState.robots.index(robot)] = look(robot, simulationState)

    for leaderRobots in simulationState.colorsWithLeader:
        for ldRobot in leaderRobots.leaders:
            robot = list(filter(lambda x: x.id == ldRobot, simulationState.robots))[0]
            simulationState.robots[simulationState.robots.index(robot)] = compute(robot)

    for leaderRobots in simulationState.colorsWithLeader:
        for ldRobot in leaderRobots.leaders:
            robot = list(filter(lambda x: x.id == ldRobot, simulationState.robots))[0]
            simulationState.robots[simulationState.robots.index(robot)] = move(robot, simulationState)

    return simulationState

def isAllNodeOccupied(counter):
    return counter == 0




