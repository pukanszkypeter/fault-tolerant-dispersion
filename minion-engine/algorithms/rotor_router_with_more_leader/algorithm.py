# POWERED BY BENCUS
import random
from model import *



def look(robot, graphState):
    # Szét nézünk hogy mik az opciók ha a robot még nem finishelt
    if robot.state != RobotState.FINISHED:
        #CurrentNode
        node = list(filter(lambda x: robot.onID == x.id, graphState.nodes))
        if len(node) > 0:
            #Ha két robot leaderes csapat össsze találkozik akkor egyből közös vezetőt választanak

            node = node[0]
            otherLeadersOnThisNode = []
            for j in graphState.colorsWithLeader:
                for ldRobot in j.leaders:
                    robots = list(filter(lambda x: node.id == x.onID and x.id == ldRobot, graphState.robots))
                    if len(robots) > 0:
                        otherLeadersOnThisNode.append(robots[0])

                if len(otherLeadersOnThisNode) > 0:
                    otherLeadersOnThisNode.append(robot)
                    chosenLeader = otherLeadersOnThisNode[random.randint(0, len(otherLeadersOnThisNode)-1)]
                    graphState.colorsWithLeader[graphState.colorsWithLeader.index(j)].leaders = []
                    graphState.colorsWithLeader[graphState.colorsWithLeader.index(j)].leaders.append(chosenLeader.id)


            robotsOnTheNodeWithLeader = list(filter(lambda x: x.color == robot.color and x.id != robot.id and x.state != RobotState.FINISHED, graphState.robots))

            #Ha minden őt k9övető robot letelepedett akkor letepelszik ő is.
            if len(robotsOnTheNodeWithLeader) == 0 and node.state != NodeState.OCCUPIED:
                graphState.robots[graphState.robots.index(robot)].options = None
            else:

                if node.state != NodeState.OCCUPIED:
                    chosenLeader = robotsOnTheNodeWithLeader[random.randint(0, len(robotsOnTheNodeWithLeader)-1)]
                    graphState.robots[graphState.robots.index(chosenLeader)].options = None

                options = list(map(lambda x: x.fromID if node.id == x.toID else x.toID,
                                   list(filter(lambda x: (x.color == robot.color) and (x.toID == node.id or x.fromID == node.id), graphState.edges))))

                if len(options) > 1:
                    # Megnézzük, ha van robot a jelenlegi node-on akkor kizárjuk a lastEdgeId lehetőséget.
                    setledRobotAtCurrentNode = list(filter(lambda x: x.onID == node.id, graphState.robots))
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
        node = list(filter(lambda x: robot.onID == x.id, graphState.nodes))[0]

        setledRobot = list(filter(lambda x: x.state == RobotState.FINISHED and x.onID == robot.onID , graphState.robots))
        if len(setledRobot) > 0:
            graphState.robots[graphState.robots.index(setledRobot[0])].lastEdgeId = robot.options[0]

        if robot.options is None:
            graphState.robots[graphState.robots.index(robot)].state = RobotState.FINISHED
            graphState.nodes[graphState.nodes.index(node)].state = NodeState.OCCUPIED
            graphState.counter -= 1
        else:
            robot.onID = robot.options[0]

        #Tobbi robot koveti a vezetot
        for i in graphState.robots:
            if i.color == robot.color and i.state != RobotState.FINISHED and i.options is not None:
                graphState.robots[graphState.robots.index(i)].onID = robot.onID
            if i.color == robot.color and i.state != RobotState.FINISHED and i.options is None:
                graphState.robots[graphState.robots.index(i)].state = RobotState.FINISHED
                graphState.nodes[graphState.nodes.index(node)].state = NodeState.OCCUPIED
                graphState.counter -= 1

    return robot

def chooseLeaderRobot(graphState):
    ##init
    colors = set(list(map(lambda x: x.color, graphState.robots)))
    for i in colors:
        colorWithLeader = ColorWithLeader(i)
        for node in graphState.nodes:
            robots = list(filter(lambda x: x.color == i and x.onID == node.id and x.state != RobotState.FINISHED, graphState.robots))

            if len(robots) > 0:
                robotId = robots[random.randint(0, len(robots)-1)].id
                colorWithLeader.leaders.append(robotId)

        graphState.colorsWithLeader.append(colorWithLeader)

    return graphState

def rotorRouterWithLeaderPlay(graphState):
    steps = 0
    while not isAllNodeOccupied(graphState.counter):
        graphState = rotorRouterWithLeaderStep(graphState)
        steps += 1
    return steps


def rotorRouterWithLeaderStep(graphState):

    graphState = chooseLeaderRobot(graphState)


    for leaderRobots in graphState.colorsWithLeader:
        for ldRobot in leaderRobots.leaders:
            robot = list(filter(lambda x: x.id == ldRobot, graphState.robots))[0]
            graphState.robots[graphState.robots.index(robot)] = look(robot, graphState)

    for leaderRobots in graphState.colorsWithLeader:
        for ldRobot in leaderRobots.leaders:
            robot = list(filter(lambda x: x.id == ldRobot, graphState.robots))[0]
            graphState.robots[graphState.robots.index(robot)] = compute(robot)

    for leaderRobots in graphState.colorsWithLeader:
        for ldRobot in leaderRobots.leaders:
            robot = list(filter(lambda x: x.id == ldRobot, graphState.robots))[0]
            graphState.robots[graphState.robots.index(robot)] = move(robot, graphState)

    return graphState

def isAllNodeOccupied(counter):
    return counter == 0


# EXAMPLE

nodes = [Node(1, NodeState.PENDING), Node(2, NodeState.DEFAULT),
         Node(3, NodeState.DEFAULT), Node(4, NodeState.DEFAULT), Node(5, NodeState.DEFAULT)]

edges = [Edge(1, 1, 2, 'blue'), Edge(2, 1, 3, 'blue'), Edge(3, 1, 4, 'blue'), Edge(4, 1, 5, 'red'),
         Edge(5, 2, 3, 'blue'), Edge(6, 2, 4, 'red'), Edge(7, 2, 5, 'blue'),
         Edge(8, 3, 4, 'blue'), Edge(9, 3, 5, 'blue'),
         Edge(10, 4, 5, 'blue')]

edges2 = [Edge(1, 1, 2, 'blue'), Edge(2, 2, 3, 'blue'), Edge(3, 3, 4, 'blue'), Edge(4, 4, 5, 'blue'),
          Edge(5, 5, 6, 'blue'), Edge(6, 6, 7, 'dark')]

robots = [Robot(1, 1, 'blue', RobotState.SEARCHING), Robot(2, 1, 'blue', RobotState.SEARCHING),
          Robot(3, 3, 'blue', RobotState.SEARCHING), Robot(4, 3, 'blue', RobotState.SEARCHING),
          Robot(5, 3, 'blue', RobotState.SEARCHING)]

graphState = GraphState(nodes, edges, robots)
'''
for i in graphState.robots:
    print(i.onID)

for i in rotorRouterStep(graphState).robots:
    print(i.onID)
'''
print(rotorRouterWithLeaderPlay(graphState))



