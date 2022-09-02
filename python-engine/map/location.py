from geopy.exc import GeocoderTimedOut
from geopy.geocoders import Nominatim
import osmnx as ox
from shapely import geometry
import json


class MapNode:
    def __init__(self, id, X, Y, osmID):
        self.id = id
        self.X = X
        self.Y = Y
        self.osmID = osmID

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)
            

class MapGraph:
    def __init__(self, nodes, edges):
        self.nodes = nodes
        self.edges = edges


    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)


class MapEdge:
    def __init__(self, id, fromID, toID):
         self.id = id
         self.fromID = fromID
         self.toID = toID

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)           


def findCityByLocation(lat, lng):
    
    # initialize Nominatim API
    try:
        geolocator = Nominatim(user_agent="dispersion-app")
    except GeocoderTimedOut:
        return findCityByLocation(lat, lng)

    location = geolocator.reverse(str(lat) + "," + str(lng))

    if location != None:
        address = location.raw['address']
        country = address.get('country', '')
        city = address.get('city', '')
        if (country != '' and city != ''):
            return {'location': country + ', ' + city, 'lat': location.latitude, 'lng': location.longitude}
        else:
            return None
    else:
        return None

def findCityByName(cityName):

    # initialize Nominatim API
    try:
        geolocator = Nominatim(user_agent="dispersion-app")
    except GeocoderTimedOut:
        return findCityByName(cityName)

    location = geolocator.geocode(cityName)

    if location != None:
        address =  geolocator.reverse(str(location.latitude) + "," + str(location.longitude)).raw['address']
        country = address.get('country', '')
        city = address.get('city', '')
        if (country != '' and city != ''):
            return {'location': country + ', ' + city, 'lat': location.latitude, 'lng': location.longitude}
        else:
            return None
    else:
        return None

def createNetwork(polygon):
    polypoints = []
    for point in polygon:
        polypoints.append([point['lng'], point['lat']])

    polygonShape = geometry.Polygon(polypoints)

    G = ox.graph_from_polygon(polygon = polygonShape, network_type='drive')

    nodes = []
    index = 0
    for node in G.nodes:
        index += 1
        nodes.append(MapNode(index, G.nodes[node]['y'], G.nodes[node]['x'], node))

    edges = []
    index = 0
    for edge in G.edges(data = True):   
        currentFrom = list(filter(lambda x : x.osmID == edge[0], nodes))[0]
        currentTo = list(filter(lambda x : x.osmID == edge[1], nodes))[0]

        # Check edge duplicates
        checkEdgeAlreadyIn = list(filter(lambda x: x.fromID == currentTo.id and x.toID == currentFrom.id ,edges))
        if len(checkEdgeAlreadyIn) == 0:
            index += 1
            edges.append(MapEdge(index, currentFrom.id, currentTo.id))

    return  MapGraph(list(map(lambda x: x.toJSON(), nodes)), list(map(lambda x: x.toJSON(), edges))).toJSON()
