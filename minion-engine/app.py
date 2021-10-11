# Webserver
from flask import Flask, jsonify, request, render_template, send_from_directory
import warnings
import sqlite3
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

@app.route("/api/engine/logger/random-with-color-constraints", methods=['POST'])
def addRandomWithColorConstraints():
    try:
        connection = sqlite3.connect("data/memory.sqlite")
        cursor = connection.cursor()

        parameters = request.get_json()
        sql_insert_query = "insert into random_with_color_constraints (graph_type, nodes, robots, colors, steps) values ('" + parameters['graph_type'] + "', " + str(parameters['nodes']) + ", " + str(parameters['robots']) + ", " + str(parameters['colors']) + ", " + str(parameters['steps']) + ")"
        
        cursor.execute(sql_insert_query)
        inserted_id = cursor.lastrowid
        connection.commit()

        cursor.close()

    except sqlite3.Error as error:
        print("Failed to insert data into SQLite table!", error)
    finally:
        if connection:
            connection.close()
            return jsonify(inserted_id)

@app.route("/api/engine/logger/leader-with-color-constraints", methods=['POST'])
def addLeaderWithColorConstraints():
    try:
        connection = sqlite3.connect("data/memory.sqlite")
        cursor = connection.cursor()

        parameters = request.get_json()
        sql_insert_query = "insert into leader_with_color_constraints (graph_type, nodes, robots, colors, steps) values ('" + parameters['graph_type'] + "', " + str(parameters['nodes']) + ", " + str(parameters['robots']) + ", " + str(parameters['colors']) + ", " + str(parameters['steps']) + ")"
        
        cursor.execute(sql_insert_query)
        inserted_id = cursor.lastrowid
        connection.commit()
        
        cursor.close()

    except sqlite3.Error as error:
        print("Failed to insert data into SQLite table!", error)
    finally:
        if connection:
            connection.close()
            return jsonify(inserted_id)

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)