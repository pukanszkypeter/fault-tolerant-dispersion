# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
import warnings
from algorithms import model, random_algorithm

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

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)
