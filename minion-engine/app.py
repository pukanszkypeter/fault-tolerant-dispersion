# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
import warnings
from algorithms import model, random_algorithm, random_with_leader_algorithm, rotor_router_algorithm, rotor_router_with_leader_algorithm
from logger import logger

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

@app.route('/api/engine/random-with-leader/step', methods=['POST'])
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

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)