# Webserver
from flask import Flask, Response, jsonify, request, render_template, send_from_directory, stream_with_context
import warnings
from algorithms import model, random_algorithm, random_with_leader_algorithm, rotor_router, rotor_router_with_leader
from logger import logger

warnings.filterwarnings('ignore', category=UserWarning)

# http://localhost:5000
HOST = '0.0.0.0'
PORT = 5000

app = Flask(__name__, template_folder='templates')

# Web Server home page
@app.route('/')
def index():
    return render_template('index.html')

# Fav icon
@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/api/engine/random/step', methods=['POST'])
def stepRandom():
    return random_algorithm.stepRandom(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/random/test', methods=['POST'])
def testRandom():
    # return jsonify(random_algorithm.testRandom(request.get_json()))
    return Response(stream_with_context(random_algorithm.testRandomAsStream(request.get_json())))

@app.route('/api/engine/random-with-leader/step', methods=['POST'])
def stepRandomWithLeader():
    return random_with_leader_algorithm.stepRandomWithLeader(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/rotor-router/step', methods=['POST'])
def stepRotor():
    return rotor_router.rotorRouterStep(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/rotor-router-with-leader/step', methods=['POST'])
def stepRotorWithLeader():
    return rotor_router_with_leader.rotorRouterWithLeaderStep(model.SimulationState(request.get_json())).jsonify()

@app.route('/api/engine/logger', methods=['POST'])
def log():
    return jsonify(logger.Logger(request.get_json()).log())

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)
