# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
import warnings
import os

from visulaziation import visualization
from map import location

warnings.filterwarnings('ignore', category=UserWarning)

# http://localhost:5000
HOST = '0.0.0.0'
PORT = 5000

app = Flask(__name__, template_folder='templates')

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Fav icon
@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


# Open Street Map
@app.route('/api/engine/open-street-map/city/location', methods=['GET'])
def findCityByLocation():
    return jsonify(location.findCityByLocation(request.args.get('lat'), request.args.get('lng')))

@app.route('/api/engine/open-street-map/city/name', methods=['GET'])
def findCityByName():
    return jsonify(location.findCityByName(request.args.get('cityName')))

@app.route('/api/engine/open-street-map/network', methods=['POST'])
def createNetwork():
    return jsonify(location.createNetwork(request.get_json()))

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)
