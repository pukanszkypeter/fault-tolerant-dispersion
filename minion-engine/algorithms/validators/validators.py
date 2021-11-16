class GraphValidator:
    def __init__(self, edges):
        self.edges = edges

    def validateConnection(self):
        colors = set(list(map(lambda x: x.color, self.edges)))

        #Check if all color has a connected component
        allColor = len(colors)
        goodColorComponents = 0
        for color in colors:
            edgesWithActualColor = list(filter(lambda x: x.color == color, self.edges))
            if len(edgesWithActualColor) == 1:
                goodColorComponents += 1
            elif len(edgesWithActualColor) == 2:
                if (edgesWithActualColor[0].toID == edgesWithActualColor[1].toID or edgesWithActualColor[0].fromID == edgesWithActualColor[1].fromID) or (edgesWithActualColor[0].toID == edgesWithActualColor[1].fromID or edgesWithActualColor[0].fromID == edgesWithActualColor[1].toID)  :
                    goodColorComponents += 1

            else:
                connectedEdges = []
                #check first and last:
                if (edgesWithActualColor[0].fromID == edgesWithActualColor[1].fromID or edgesWithActualColor[0].toID == edgesWithActualColor[1].toID) or (edgesWithActualColor[0].toID == edgesWithActualColor[1].fromID or edgesWithActualColor[0].fromID == edgesWithActualColor[1].toID):
                    connectedEdges.append(edgesWithActualColor[0])


                if (edgesWithActualColor[len(edgesWithActualColor)-2].toID == edgesWithActualColor[len(edgesWithActualColor)-1].toID or edgesWithActualColor[len(edgesWithActualColor)-2].fromID == edgesWithActualColor[len(edgesWithActualColor)-1].fromID) or (edgesWithActualColor[len(edgesWithActualColor)-2].toID == edgesWithActualColor[len(edgesWithActualColor)-1].fromID or edgesWithActualColor[len(edgesWithActualColor)-2].fromID == edgesWithActualColor[len(edgesWithActualColor)-1].toID):
                    connectedEdges.append(edgesWithActualColor[len(edgesWithActualColor)-1])

                index = 1
                while index <= len(edgesWithActualColor) - 2:
                    if (edgesWithActualColor[index].toID == edgesWithActualColor[index+1].toID or edgesWithActualColor[index].fromID == edgesWithActualColor[index+1].fromID) or (edgesWithActualColor[index].toID == edgesWithActualColor[index+1].fromID or edgesWithActualColor[index].fromID == edgesWithActualColor[index+1].toID):
                        connectedEdges.append(edgesWithActualColor[index])

                    elif (edgesWithActualColor[index].toID == edgesWithActualColor[index-1].toID or edgesWithActualColor[index].fromID == edgesWithActualColor[index-1].fromID) or (edgesWithActualColor[index].toID == edgesWithActualColor[index-1].fromID or edgesWithActualColor[index].fromID == edgesWithActualColor[index-1].toID):

                        connectedEdges.append(edgesWithActualColor[index])
                    index += 1

                if len(connectedEdges) == len(edgesWithActualColor):
                    goodColorComponents += 1

        if goodColorComponents == allColor:
            print("ok")
        else:
            print("kéne")
            print(allColor)
            print("kapunk")
            print(goodColorComponents)

