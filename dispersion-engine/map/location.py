from geopy.exc import GeocoderTimedOut
from geopy.geocoders import Nominatim

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
    
    # To-Do
    print(polygon)

    return polygon