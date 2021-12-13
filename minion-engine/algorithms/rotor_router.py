import random
from algorithms.model import *


def look(robot, simulationState):
    if robot.state != RobotState.FINISHED:
        #Megnezzuk hogy a currentNodeon van e szabad hely és vannak-e másrobotok

        node = list(filter(lambda x: robot.onID == x.id, simulationState.nodes))
        if len(node) > 0:
            node = node[0]
            robotsOnTheNode = list(filter(lambda x: x.onID == node.id, simulationState.robots))
            chosenLeader = robotsOnTheNode[random.randint(0, len(robotsOnTheNode)-1)]
            if node.state != NodeState.OCCUPIED and len(list(filter(lambda x: x.options is None, robotsOnTheNode))) == 0:
                simulationState.robots[simulationState.robots.index(chosenLeader)].options = None
                if robot.id == simulationState.robots[simulationState.robots.index(chosenLeader)].id:
                    robot.options = None

            if robot.options is not None and len(list(filter(lambda x: x.options is None, robotsOnTheNode))) != 0:
                #Kigyűjtjük az opciókat
                options = list(map(lambda x: x.fromID if node.id == x.toID else x.toID,
                                   list(filter(lambda x: (x.color == robot.color) and (x.toID == node.id or x.fromID == node.id), simulationState.edges))))

                if len(options) > 1:
                    # Megnézzük, ha van robot a jelenlegi node-on akkor kizárjuk a lastEdgeId lehetőséget.
                    setledRobotAtCurrentNode = list(filter(lambda x: x.onID == node.id and x.state == RobotState.FINISHED, simulationState.robots))
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
        if robot.options is None:
            node = list(filter(lambda x: robot.onID == x.id, simulationState.nodes))[0]
            simulationState.robots[simulationState.robots.index(robot)].state = RobotState.FINISHED
            simulationState.nodes[simulationState.nodes.index(node)].state = NodeState.OCCUPIED
            simulationState.counter -= 1
        else:
            #Beallitjuk hogy ha van letelepedett robot azon a csúcson ahonnét elindult akkor az lesz az új lastedge idja
            #robot.options[0] út választása lesz az új lastedgeid
            setledRobot = list(filter(lambda x: x.state == RobotState.FINISHED and x.onID == robot.onID , simulationState.robots))
            if len(setledRobot) > 0:
                simulationState.robots[simulationState.robots.index(setledRobot[0])].lastEdgeId = robot.options[0]

            robot.onID = robot.options[0]
    return robot


def rotorRouterPlay(simulationState):
    steps = 0
    while not isAllNodeOccupied(simulationState.counter):
        simulationState = rotorRouterStep(simulationState)
        steps += 1

    if isAllNodeOccupied(simulationState.counter):
        print("sikeres moka")
        print(steps)


# Egy LCM ciklus után lehetne egy általános sorsolás hogy ki telepedhessen le!
def rotorRouterStep(simulationState):

    for robot in simulationState.robots:
        simulationState.robots[simulationState.robots.index(robot)] = look(robot, simulationState)

    for robot in simulationState.robots:
        simulationState.robots[simulationState.robots.index(robot)] = compute(robot)

    for robot in simulationState.robots:
        simulationState.robots[simulationState.robots.index(robot)] = move(robot, simulationState)

    return simulationState

def isAllNodeOccupied(counter):
    return counter == 0
