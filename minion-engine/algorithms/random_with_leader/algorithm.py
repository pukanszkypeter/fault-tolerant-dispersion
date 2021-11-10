# POWERED BY BENCUS
import random

class NodeState:
    PENDING = '#ff0000'
    VISITED = '#ff9900'
    OCCUPIED = '#33cc33'


class RobotState:
    SEARCHING = 'SEARCHING'
    FINISHED = 'FINISHED'


class Node:
    def __init__(self, id, label, state):
        self.id = id
        self.label = label
        self.state = state

class Edge:
    def __init__(self, id, fromPoint, to, color, oldColor):
        self.id = id
        self.fromPoint = fromPoint
        self.to = to
        self.color = color
        self.oldColor = oldColor


class Robot:
    def __init__(self, id, on, state, color):
        self.id = id
        self.on = on
        self.state = state
        self.color = color

class ColorsWithLeaders:
    def __init__(self, leaderId, color):
        self.leaderId = leaderId
        self.color = color



class GraphState:
    def __init__(self, nodes, edges, robots, colorsWithLeaders):
        self.nodes = nodes
        self.edges = edges
        self.robots = robots
        self.colorsWithLeaders = colorsWithLeaders


def randomWithLeaderAlgorithm(graphState):
    if isAllNodeOccupied(graphState):
        #Init leaders for mindegyik színhez! :)
        if len(graphState.colorsWithLeaders) == 0:
            colorSet = []
            for i in graphState.robots:
                colorSet.append(i.color)
            colorSet = set(colorSet)

            for i in colorSet:
                robotsWithOutLeader = graphState.robots.filter(lambda x: x.color == i)
                graphState.colorsWithLeaders.append(ColorsWithLeaders(robotsWithOutLeader[random.randint(0, len(robotsWithOutLeader))].id, i))
        else:
            #Szin csoportonként megyünk és a vezetőket követik a robotok, ha egy vezető letelepedett, mindig újat választanak és ő fog vezetni a ökvi körben.
            for i in graphState.colorsWithLeaders:
                currentLeader = graphState.robots.index(lambda x: x.id == i.leaderId)
                currentNode = graphState.nodes.index(lambda x: x.id == currentLeader.on)
                if graphState.nodes[currentNode].state is None or graphState.nodes[currentNode].state == NodeState.PENDING or graphState.nodes[currentNode].state == NodeState.VISITED:
                    graphState.robots[currentLeader].state = RobotState.FINISHED
                    graphState.nodes[currentNode].state = NodeState.OCCUPIED

                    robotsWithOutLeader = graphState.robots.filter(lambda x: x.color == i and x.state != RobotState.FINISHED and x.color == i.color)
                    if len(robotsWithOutLeader) > 0:
                        i.leaderId = robotsWithOutLeader[random.randint(0, len(robotsWithOutLeader))].id
                else:
                    options = graphState.edges.filter(lambda x: ((x.to == graphState.nodes[currentNode].id and x.color == currentLeader.color) or (x.fromPoint == graphState.nodes[currentNode].id and x.color == currentLeader)))
                    rotes = options.map(lambda x: x.to == graphState.nodes[currentNode].id if x.fromPoint else x.to)

                    if len(rotes) > 0:
                        chosenRote = rotes[random.randint(0, len(rotes))]
                        graphState.robots[currentLeader].on = chosenRote

                        chosenNodeId = graphState.nodes.index(lambda x: x.id == chosenRote)
                        if graphState.nodes[chosenNodeId].state != NodeState.OCCUPIED:
                            graphState.nodes[chosenNodeId].state = NodeState.PENDING
                    else:
                        return {}
                    #A robotok követik a szín csoportuk vezetőjét aki már elfoglalta az új helyét
                    robotsWithLeader = graphState.robots.filter(lambda x: x.state != RobotState.FINISHED and x.color == graphState.robots[currentLeader].color)
                    for j in robotsWithLeader:
                        graphState.robots[graphState.robots.index(lambda x: x.id == j.id)].on = graphState.robots[currentLeader].on


        return graphState
    else:
        return None


def isAllNodeOccupied(graphState):
    return len(graphState.nodes.filter(lambda x: x.state == NodeState.PENDING or x.state == NodeState.VISITED)) != 0