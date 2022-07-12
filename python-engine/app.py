# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
import warnings
import os

import visulaziation.visualization
from algorithms import model, random_algorithm, random_with_leader_algorithm, rotor_router_algorithm, rotor_router_with_leader_algorithm
from logger import logger
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

# Random
@app.route('/api/engine/random/step', methods=['POST'])
def stepRandom():
    return random_algorithm.step(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/random/test', methods=['POST'])
def testRandom():
    return jsonify(random_algorithm.test(request.get_json()))

# Random with leader
@app.route('/api/engine/random-with-leader/step', methods=['POST'])
def stepRandomWithLeader():
    return random_with_leader_algorithm.step(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/random-with-leader/test', methods=['POST'])
def testRandomWithLeader():
    return jsonify(random_with_leader_algorithm.test(request.get_json()))

# Rotor router
@app.route('/api/engine/rotor-router/step', methods=['POST'])
def stepRotorRouter():
    return rotor_router_algorithm.step(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/rotor-router/test', methods=['POST'])
def testRotorRouter():
    return jsonify(rotor_router_algorithm.test(request.get_json()))
    
# Rotor router with leader
@app.route('/api/engine/rotor-router-with-leader/step', methods=['POST'])
def stepRotorRouterWithLeader():
    return rotor_router_with_leader_algorithm.step(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/rotor-router-with-leader/test', methods=['POST'])
def testRotorRouterWithLeader():
    return jsonify(rotor_router_with_leader_algorithm.test(request.get_json()))

# Logger
@app.route('/api/engine/logger', methods=['POST'])
def log():
    return jsonify(logger.Logger(request.get_json()).log())

# Visualization
@app.route('/api/engine/visualization/summary-by', methods=['POST'])
def summary():
    return jsonify(visualization.summaryByQuery(request.get_json()['summaryBy']))

@app.route('/api/engine/visualization/group-by', methods=['POST'])
def groupBy():
    return jsonify(visualization.groupByQuery(request.get_json()['algorithmType'], request.get_json()['graphType'], request.get_json()['groupBy']))

@app.route('/api/engine/visualization/detail-by', methods=['POST'])
def detailBy():
    return jsonify(visualization.detailByQuery(request.get_json()['detailBy'], request.get_json()['algorithmType'], request.get_json()['graphType']))


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
