from enum import Enum

class NodeState(Enum):
    DEFAULT = '#ffffff'
    PENDING = '#ff0000'
    VISITED = '#ff9900'
    OCCUPIED = '#33cc33'

class RobotState(Enum):
    SEARCHING = 'SEARCHING'
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
    def __init__(self, id, onID, color, state):
        self.id = id
        self.onID = onID
        self.color = color
        self.state = state
        self.lastEdgeId = None
        self.options = []

class ColorWithLeader:
    def __init__(self, color, leaderId):
        self.color = color
        self.leaderId = leaderId

class GraphState:
    def __init__(self, nodes, edges, robots):
        self.nodes = nodes
        self.edges = edges
        self.robots = robots
        self.counter = len(nodes)
        self.colorsWithLeaders = []

    def printCurrentState(self):
        print("NODES")
        for node in self.nodes:
            print(str(node.id) + ' ' + str(node.state))
        print("ROBOTS")
        for robot in self.robots:
            print(str(robot.id) + ' ' + str(robot.onID) + ' ' + robot.color)

    def printGraphState(self):
        print("NODES")
        for node in self.nodes:
            print(str(node.id) + ' ' + str(node.state))
        print("EDGES")
        for edge in self.edges:
            print(str(edge.fromID) + ' ' + str(edge.toID) + ' ' + edge.color)
        print("ROBOTS")
        for robot in self.robots:
            print(str(robot.id) + ' ' + str(robot.onID) + ' ' + str(robot.state) + ' ' + robot.color)
