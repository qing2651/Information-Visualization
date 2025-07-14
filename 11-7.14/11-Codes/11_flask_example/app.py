from flask import Flask, render_template, request, jsonify, redirect
from core import return_string
from core import return_sum

import os

app = Flask(__name__)

@app.route("/getdata")
def getdata():
    eventname = request.args.get('event_name')
    num1 = request.args.get('num_1', 0, type=int)
    num2 = request.args.get('num_2', 0, type=int)
    return jsonify( return_sum(eventname, num1, num2) )
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculate_volume")
def calculate_volume():
    length = request.args.get('length', 0, type=float)
    width = request.args.get('width', 0, type=float)
    height = request.args.get('height', 0, type=float)
    volume = length * width * height
    return jsonify({'volume': volume})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 9991))
    app.run(host='0.0.0.0', port=port)