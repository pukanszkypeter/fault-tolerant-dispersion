# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
import warnings
import sqlite3
import datetime
warnings.filterwarnings("ignore", category=UserWarning)

# http://localhost:5000
HOST = '0.0.0.0'
PORT = 5000

app = Flask(__name__, template_folder='templates')

# Web Server home page
@app.route("/")
def index():
    return render_template("index.html")

# Fav icon
@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/api/engine/logger/random", methods=['POST'])
def addRandom():
    try:
        connection = sqlite3.connect("data/memory.sqlite", detect_types = sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
        cursor = connection.cursor()

        parameters = request.get_json()
        currentDateTime = datetime.datetime.now()
        sql_insert_query = """insert into random_with_color_constraints
                    (graph_type, nodes, robots, colors, steps, date) values (?, ?, ?, ?, ?, ?)"""

        cursor.execute(sql_insert_query, (parameters['graph_type'], parameters['nodes'], parameters['robots'], parameters['colors'], parameters['steps'], currentDateTime))
        inserted_id = cursor.lastrowid
        connection.commit()

        cursor.close()

    except sqlite3.Error as error:
        print("Failed to insert data into SQLite table!", error)
    finally:
        if connection:
            connection.close()
            return jsonify(inserted_id)

@app.route("/api/engine/logger/random-with-leader", methods=['POST'])
def addRandomWithLeader():
    try:
        connection = sqlite3.connect("data/memory.sqlite", detect_types = sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
        cursor = connection.cursor()

        parameters = request.get_json()
        currentDateTime = datetime.datetime.now()
        sql_insert_query = """insert into leader_with_color_constraints
            (graph_type, nodes, robots, colors, steps, date) values (?, ?, ?, ?, ?, ?)"""
        
        cursor.execute(sql_insert_query, (parameters['graph_type'], parameters['nodes'], parameters['robots'], parameters['colors'], parameters['steps'], currentDateTime))
        inserted_id = cursor.lastrowid
        connection.commit()
        
        cursor.close()

    except sqlite3.Error as error:
        print("Failed to insert data into SQLite table!", error)
    finally:
        if connection:
            connection.close()
            return jsonify(inserted_id)

@app.route("/api/engine/logger/rotor-router", methods=['POST'])
def addRotorRouter():
    try:
        connection = sqlite3.connect("data/memory.sqlite", detect_types = sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
        cursor = connection.cursor()

        parameters = request.get_json()
        currentDateTime = datetime.datetime.now()
        sql_insert_query = """insert into rotor_router_with_color_constraints
            (graph_type, nodes, robots, colors, steps, date) values (?, ?, ?, ?, ?, ?)"""

        cursor.execute(sql_insert_query, (parameters['graph_type'], parameters['nodes'], parameters['robots'], parameters['colors'], parameters['steps'], currentDateTime))
        inserted_id = cursor.lastrowid
        connection.commit()

        cursor.close()

    except sqlite3.Error as error:
        print("Failed to insert data into SQLite table!", error)
    finally:
        if connection:
            connection.close()
            return jsonify(inserted_id)

"""
@app.route("/api/engine/tests/random", methods['POST'])
def testRandom():
    try:
        connection = sqlite3.connect("data/memory.sqlite", detect_types = sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
        cursor = connection.cursor()

        parameters = request.get_json()
        json_nodes = parameters['nodes']
        for (node in json_nodes):
            Node(node['id'], )
        json_edges = parameters['edges']
        json_robots = parameters['robots']
        currentDateTime = datetime.datetime.now()
        sql_insert_query = insert into rotor_router_with_color_constraints
            (graph_type, nodes, robots, colors, steps, date) values (?, ?, ?, ?, ?, ?)

        cursor.execute(sql_insert_query, (parameters['graph_type'], parameters['nodes'], parameters['robots'], parameters['colors'], parameters['steps'], currentDateTime))
        inserted_id = cursor.lastrowid
        connection.commit()

        cursor.close()

    except sqlite3.Error as error:
        print("Failed to insert data into SQLite table!", error)
    finally:
        if connection:
            connection.close()
            return jsonify(inserted_id)
"""
if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)
