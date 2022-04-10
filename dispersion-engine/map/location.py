from geopy.exc import GeocoderTimedOut
from geopy.geocoders import Nominatim
import osmnx as ox
from shapely import geometry
import json

# PLS help me with fuckin moduling
class MapNode:
    def __init__(self, id, X, Y):
        self.id = id
        self.X = X
        self.Y = Y

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
        nodes.append(MapNode(index, G.nodes[node]['y'], G.nodes[node]['x']))

    return list(map(lambda x: x.toJSON(), nodes))