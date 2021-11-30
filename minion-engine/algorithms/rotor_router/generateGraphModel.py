from algorithms.rotor_router.algorithm import rotorRouterPlay

class RunRotorRouterMeasurement:
    def __init__(self, graphState, testNumber):
        self.graphState = graphState
        self.testNumber = testNumber
        self.results = []

    def simulate(self):
        for i in self.testNumber:
            localGraphState = self.graphState
            self.results.append(rotorRouterPlay(localGraphState))
        return self.results

