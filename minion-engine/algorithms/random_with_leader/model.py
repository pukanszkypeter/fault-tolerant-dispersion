from enum import Enum

class NodeState(Enum):
    DEFAULT = '#ffffff'
    PENDING = '#ff0000'
    OCCUPIED = '#33cc33'

class RobotState(Enum):
    SEARCHING = 'SEARCHING'
    LEADER = 'LEADER'
    FINISHED = 'FINISHED'

class Node:
    def __init__(self, id, state):
        self.id = id
        self.state = state

class Edge:
    def __init__(self, id, fromID, toID, color):
        self.id = id
        self.fromID = fromID
        self.toID = toID
        self.color = color

class Robot:
    def __init__(self, id, onID, state, color):
        self.id = id
        self.onID = onID
        self.destinationID = 0
        self.state = state
        self.color = color

class GraphState:
    COLOR_CONSTRAINT = True

    def __init__(self, nodes, edges, robots):
        self.nodes = nodes
        self.edges = edges
        self.robots = robots
        self.counter = len(nodes)

    def getNode(self, nodeID):
        for node in self.nodes:
            if node.id == nodeID:
                return node

    def getEdgeOptions(self, robot, isColorConstraint):
        if not isColorConstraint:
            return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID, 
                    list(filter(lambda x: x.fromID == robot.onID or x.toID == robot.onID, self.edges))))
        else:
            return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID, 
                    list(filter(lambda x: (x.fromID == robot.onID and x.color == robot.color) or (x.toID == robot.onID and x.color == robot.color), self.edges))))

    def printCurrentState(self):
        print("NODES")
        for node in self.nodes:
            print(str(node.id) + " " + str(node.state))
        print("ROBOTS")
        for robot in self.robots:
            print(str(robot.id) + " " + str(robot.onID) + " " + str(robot.state))