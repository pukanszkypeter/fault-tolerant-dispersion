from enum import Enum
import json

class NodeState(Enum):
    DEFAULT = '#ffffff'
    PENDING = '#ff0000'
    OCCUPIED = '#33cc33'

class RobotState(Enum):
    SEARCHING = 'SEARCHING'
    LEADER = 'LEADER'
    FINISHED = 'FINISHED'
    SETLER = 'SETLER'

class ColorWithLeader:
    def __init__(self, color):
        self.color = color
        self.leaders = []

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
    def __init__(self, id, onID, state, color, lastEdgeID):
        self.id = id
        self.onID = onID
        self.destinationID = 0
        self.state = state
        self.color = color
        self.lastEdgeID = lastEdgeID
        self.options = []

class SimulationState:
    COLOR_CONSTRAINT = True

    def __init__(self, json):
        self.nodes = []
        for node in json['nodes']:
            self.nodes.append(Node(node['id'], NodeState(node['state'])))
        self.edges = []
        for edge in json['edges']:
            self.edges.append(Edge(edge['id'], edge['fromID'], edge['toID'], edge['color']))
        self.robots = []
        for robot in json['robots']:
            self.robots.append(Robot(robot['id'], robot['onID'], RobotState(robot['state']), robot['color'], robot['lastEdgeID']))
        self.counter = json['counter']

    def jsonify(self):
        nodes = []
        for node in self.nodes:
            nodes.append({'id': node.id, 'state': node.state.value})
        edges = []
        for edge in self.edges:
            edges.append({'id': edge.id, 'fromID': edge.fromID, 'toID': edge.toID, 'color': edge.color})
        robots = []
        for robot in self.robots:
            robots.append({'id': robot.id, 'onID': robot.onID, 'state': robot.state.value, 'color': robot.color, 'lastEdgeID': robot.lastEdgeID})
        
        return json.dumps({'nodes': nodes, 'edges': edges, 'robots': robots, 'counter': self.counter})

    # Helper Methods
    def getNode(self, nodeID):
        for node in self.nodes:
            if node.id == nodeID:
                return node

    def getRobot(self, robotId):
        for robot in self.robots:
            if robot.id == robotId:
                return robot

    def getEdgeOptions(self, robot, isColorConstraint):
        if not isColorConstraint:
            return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID, 
                    list(filter(lambda x: x.fromID == robot.onID or x.toID == robot.onID, self.edges))))
        else:
            return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID, 
                    list(filter(lambda x: (x.fromID == robot.onID and x.color == robot.color) or (x.toID == robot.onID and x.color == robot.color), self.edges))))

    def getEdgeOptionsWithRotor(self, robot):
        setledRobot = list(filter(lambda x: x.onID == robot.onID, self.robots))
        if len(setledRobot) == 0:
            return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID,
                                list(filter(lambda x: (x.fromID == robot.onID and x.color == robot.color) or (x.toID == robot.onID and x.color == robot.color), self.edges))))
        else:
            options = list(filter(lambda x: (x.fromID == robot.onID and x.color == robot.color) or (x.toID == robot.onID and x.color == robot.color), self.edges))
            if len(options) > 1:
                options = list(filter(lambda x: ((x.fromID == robot.onID and x.color == robot.color) or (x.toID == robot.onID and x.color == robot.color)) and x.id != setledRobot[0].lastEdgeID, self.edges))
                return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID, options))
            else:
                return list(map(lambda x: x.fromID if robot.onID == x.toID else x.toID, options))

    def printCurrentState(self):
        print("NODES")
        for node in self.nodes:
            print(str(node.id) + " " + str(node.state))
        print("ROBOTS")
        for robot in self.robots:
            print(str(robot.id) + " " + str(robot.onID) + " " + str(robot.state))
