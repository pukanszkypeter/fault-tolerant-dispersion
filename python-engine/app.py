# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
import warnings
import os

from logger import logger
from visulaziation import visualization
from map import location

warnings.filterwarnings('ignore', category=UserWarning)

HOST = '0.0.0.0'
PORT = 5000

app = Flask(__name__, template_folder='templates')
CORS(app)

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Fav icon
@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# Logger
@app.route('/api/python-engine/logger', methods=['POST'])
def log():
    return jsonify(logger.Logger(request.get_json()).log())

# Visualization
@app.route('/api/python-engine/visualization/summary-by', methods=['POST'])
def summary():
    return jsonify(visualization.summaryByQuery(request.get_json()['summaryBy']))

@app.route('/api/python-engine/visualization/group-by', methods=['POST'])
def groupBy():
    return jsonify(visualization.groupByQuery(request.get_json()['algorithmType'], request.get_json()['graphType'], request.get_json()['groupBy']))

@app.route('/api/python-engine/visualization/detail-by', methods=['POST'])
def detailBy():
    return jsonify(visualization.detailByQuery(request.get_json()['detailBy'], request.get_json()['algorithmType'], request.get_json()['graphType']))

# Open Street Map
@app.route('/api/python-engine/open-street-map/city/location', methods=['GET'])
def findCityByLocation():
    return jsonify(location.findCityByLocation(request.args.get('lat'), request.args.get('lng')))

@app.route('/api/python-engine/open-street-map/city/name', methods=['GET'])
def findCityByName():
    return jsonify(location.findCityByName(request.args.get('cityName')))

@app.route('/api/python-engine/open-street-map/network', methods=['POST'])
def createNetwork():
    return jsonify(location.createNetwork(request.get_json()))

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)