from algorithms.rotor_router_with_leader.algorithm import *

class RunRotorRouterWithLeaderMeasurement:
    def __init__(self, graphState, testNumber):
        self.graphState = graphState
        self.testNumber = testNumber
        self.results = []


    def simulate(self):
        for i in self.testNumber:
            localGraphState = self.graphState
            self.results.append(rotorRouterWithLeaderPlay(localGraphState))
        return self.results
