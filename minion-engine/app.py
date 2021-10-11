# Webserver
from flask import Flask, jsonify, request, render_template
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

# http://localhost:5000
HOST = '0.0.0.0'
PORT = 5000

app = Flask(__name__, template_folder='templates')

# Web Server home page
@app.route("/")
def index():
    return render_template("index.html")
    

if __name__ == '__main__':
    app.run(host=HOST,debug=True,port=PORT)