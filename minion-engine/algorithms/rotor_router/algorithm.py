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


class GraphState:
    def __init__(self, nodes, edges, robots, lastEdgeId):
        self.nodes = nodes
        self.edges = edges
        self.robots = robots
        self.lastEdgeId = lastEdgeId


def rotorRouter(graphState):
    if isAllNodeOccupied(graphState):
        for i in graphState.robots:
            if i.state != RobotState.FINISHED:
                currentNode = graphState.nodes.index(lambda x: x.id == i.on)

                if graphState.nodes[currentNode].state == NodeState.PENDING or graphState.nodes[currentNode].state == NodeState.VISITED:
                    i = RobotState.FINISHED
                    graphState.nodes[currentNode].state = NodeState.OCCUPIED;
                else:

                    setledRobotAtCurrentNode = graphState.robots.index(lambda x: x.on == graphState.nodes[currentNode].id)

                    options = graphState.edges.filter(lambda x: ((x.to == graphState.nodes[currentNode].id and x.color == graphState.robots[i].color) or (x.fromPoint == graphState.nodes[currentNode].id and x.color == graphState.robots[i].color)))

                    #csak a nem lastEdgeId utak maradnak meg! Ha csak 1 ut van akkor mehet arra
                    if graphState.robots[setledRobotAtCurrentNode].lastEdgeId is not None and len(options) > 1:
                        options = options.filter(lambda x: x.id != graphState.robots[setledRobotAtCurrentNode].lastEdgeId)


                    rotes = options.map(lambda x: x.to == graphState.nodes[currentNode].id if x.fromPoint else x.to)
                    if len(rotes) > 0:
                        chosenRote = rotes[random.randint(0, len(rotes))]
                        i.on = chosenRote
                        #set new lastEdge
                        graphState.robots[setledRobotAtCurrentNode].lastEdgeId = chosenRote

                        chosenNodeId = graphState.nodes.index(lambda x: x.id == chosenRote);
                        if graphState.nodes[chosenNodeId].state is None or graphState.nodes[chosenNodeId].state != NodeState.OCCUPIED:
                            graphState.nodes[chosenNodeId].state = NodeState.PENDING
                    else:
                        return {}
        return graphState
    else:
        return None


def isAllNodeOccupied(graphState):
    return len(graphState.nodes.filter(lambda x: x.state == NodeState.PENDING or x.state == NodeState.VISITED)) != 0