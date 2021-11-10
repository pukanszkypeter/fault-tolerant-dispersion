from random import randint
from model import *

def runRandom(graphState):
    steps = 0
    state = graphState

    while True:
        oldState = state
        newState = stepRandom(state)
        steps += 1

        if newState == True:
            return {'steps': steps - 1, 'result': 'FINISHED'}
        elif newState == False:
            return {'steps': steps - 1, 'result': 'FAILED'}

        state = newState

def stepRandom(graphState):
    if not isAllNodeOccupied(graphState):

        searchingRobots = list(filter(lambda x: x.state == RobotState.SEARCHING, graphState.robots))
        
        for robot in searchingRobots:
            currentNode = list(filter(lambda x: x.id == robot.onID, graphState.nodes))[0]

            # Occupy first available node (greedy)
            if currentNode.state != NodeState.OCCUPIED:
                robot.state = RobotState.FINISHED
                currentNode.state = NodeState.OCCUPIED

            else:
                options = list(map(lambda x: x.fromID if currentNode.id == x.toID else x.toID, 
                            list(filter(lambda x: (x.color == robot.color) and (x.toID == currentNode.id or x.fromID == currentNode.id), graphState.edges))))

                # check if robot can move
                if len(options) > 0:
                    route = options[randint(0, len(options) - 1)]
                    robot.onID = route

                    # old node
                    onNode = len(list(filter(lambda x: x.id != robot.id and robot.onID == currentNode.id, graphState.robots)))
                    if currentNode.state != NodeState.OCCUPIED and onNode == 0:
                        currentNode.state = NodeState.VISITED

                    # new node
                    newNode = list(filter(lambda x: x.id == route, graphState.nodes))[0]
                    if newNode.state != NodeState.OCCUPIED:
                        newNode.state = NodeState.PENDING
                else:
                    return False

        return graphState

    else:
        return True


def isAllNodeOccupied(graphState):
    return len(list(filter(lambda x: x.state == NodeState.OCCUPIED, graphState.nodes))) == len(graphState.nodes)

"""
# EXAMPLE

nodes = [Node(1, NodeState.PENDING), Node(2, NodeState.DEFAULT), 
        Node(3, NodeState.DEFAULT), Node(4, NodeState.DEFAULT), Node(5, NodeState.DEFAULT)]

edges = [Edge(1, 1, 2, 'brown'), Edge(2, 1, 3, 'brown'), Edge(3, 1, 4, 'blue'), Edge(4, 1, 5, 'blue'),
        Edge(5, 2, 3, 'blue'), Edge(6, 2, 4, 'blue'), Edge(7, 2, 5, 'blue'),
        Edge(8, 3, 4, 'blue'), Edge(9, 3, 5, 'brown'),
        Edge(10, 4, 5, 'blue')]

robots = [Robot(1, 1, 'blue', RobotState.SEARCHING), Robot(2, 1, 'blue', RobotState.SEARCHING),
        Robot(3, 1, 'brown', RobotState.SEARCHING), Robot(4, 1, 'brown', RobotState.SEARCHING),
        Robot(5, 1, 'blue', RobotState.SEARCHING)]

graphState = GraphState(nodes, edges, robots)

result = runRandom(graphState)
print(result)
"""