# POWERED BY BENCUS
import random
from algorithms.rotor_router.model import *


def look(robot, graphState):
    if robot.state != RobotState.FINISHED:
        #Megnezzuk hogy a currentNodeon van e szabad hely és vannak-e másrobotok

        node = list(filter(lambda x: robot.onID == x.id, graphState.nodes))
        if len(node) > 0:
            node = node[0]
            robotsOnTheNode = list(filter(lambda x: x.onID == node.id, graphState.robots))
            chosenLeader = robotsOnTheNode[random.randint(0, len(robotsOnTheNode)-1)]
            if node.state != NodeState.OCCUPIED and len(list(filter(lambda x: x.options is None, robotsOnTheNode))) == 0:
                graphState.robots[graphState.robots.index(chosenLeader)].options = None
                if robot.id == graphState.robots[graphState.robots.index(chosenLeader)].id:
                    robot.options = None

            if robot.options is not None and len(list(filter(lambda x: x.options is None, robotsOnTheNode))) != 0:
                #Kigyűjtjük az opciókat
                options = list(map(lambda x: x.fromID if node.id == x.toID else x.toID,
                               list(filter(lambda x: (x.color == robot.color) and (x.toID == node.id or x.fromID == node.id), graphState.edges))))

                if len(options) > 1:
                    # Megnézzük, ha van robot a jelenlegi node-on akkor kizárjuk a lastEdgeId lehetőséget.
                    setledRobotAtCurrentNode = list(filter(lambda x: x.onID == node.id and x.state == RobotState.FINISHED, graphState.robots))
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

def move(robot, graphState):
    if robot.state != RobotState.FINISHED:
        if robot.options is None:
            node = list(filter(lambda x: robot.onID == x.id, graphState.nodes))[0]
            graphState.robots[graphState.robots.index(robot)].state = RobotState.FINISHED
            graphState.nodes[graphState.nodes.index(node)].state = NodeState.OCCUPIED
            graphState.counter -= 1
        else:
            #Beallitjuk hogy ha van letelepedett robot azon a csúcson ahonnét elindult akkor az lesz az új lastedge idja
            #robot.options[0] út választása lesz az új lastedgeid
            setledRobot = list(filter(lambda x: x.state == RobotState.FINISHED and x.onID == robot.onID , graphState.robots))
            if len(setledRobot) > 0:
                graphState.robots[graphState.robots.index(setledRobot[0])].lastEdgeId = robot.options[0]

            robot.onID = robot.options[0]
    return robot


def rotorRouterPlay(graphState):
    steps = 0
    while not isAllNodeOccupied(graphState.counter):
        graphState = rotorRouterStep(graphState)
        steps += 1

    if isAllNodeOccupied(graphState.counter):
        print("sikeres moka")
        print(steps)


# Egy LCM ciklus után lehetne egy általános sorsolás hogy ki telepedhessen le!
def rotorRouterStep(graphState):

    for robot in graphState.robots:
        graphState.robots[graphState.robots.index(robot)] = look(robot, graphState)

    for robot in graphState.robots:
        graphState.robots[graphState.robots.index(robot)] = compute(robot)

    for robot in graphState.robots:
        graphState.robots[graphState.robots.index(robot)] = move(robot, graphState)

    return graphState

def isAllNodeOccupied(counter):
    return counter == 0


# EXAMPLE
'''
nodes = [Node(1, NodeState.PENDING), Node(2, NodeState.DEFAULT), 
        Node(3, NodeState.DEFAULT), Node(4, NodeState.DEFAULT), Node(5, NodeState.DEFAULT)]

edges = [Edge(1, 1, 2, 'blue'), Edge(2, 1, 3, 'blue'), Edge(3, 1, 4, 'blue'), Edge(4, 1, 5, 'blue'),
        Edge(5, 2, 3, 'blue'), Edge(6, 2, 4, 'blue'), Edge(7, 2, 5, 'blue'),
        Edge(8, 3, 4, 'blue'), Edge(9, 3, 5, 'blue'),
        Edge(10, 4, 5, 'blue')]

robots = [Robot(1, 1, 'blue', RobotState.SEARCHING), Robot(2, 1, 'blue', RobotState.SEARCHING),
        Robot(3, 1, 'blue', RobotState.SEARCHING), Robot(4, 1, 'blue', RobotState.SEARCHING),
        Robot(5, 1, 'blue', RobotState.SEARCHING)]

graphState = GraphState(nodes, edges, robots)

for i in graphState.robots:
    print(i.onID)

for i in rotorRouterStep(graphState).robots:
    print(i.onID)

rotorRouterPlay(graphState)
'''

#for robot in graphState.robots:
#    graphState.robots[graphState.robots.index(robot)] = look(robot, graphState)
#    print(graphState.robots[graphState.robots.index(robot)].options)


