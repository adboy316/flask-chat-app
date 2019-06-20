import os
import requests

from flask import Flask, jsonify, render_template, request, flash, session
from flask_socketio import SocketIO, emit
from flask_session import Session


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

socketio = SocketIO(app)

# Users currently logged in
users = []

# TODO: Channels currently made
channels = []


@app.route("/")
def index():
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        return render_template('main.html',users=users, user=session['username'])
   

@app.route("/main",  methods=['POST', 'GET'])
def main():
    if request.method == 'POST' and not session.get('logged_in'):
        username = request.form.get("username")
        if username in users:
            flash("That username is already taken!")
            return render_template('index.html')
        else:
            users.append(username)
            session['username'] = username
            session['logged_in'] = True
            return render_template('main.html', users=users, user=username)
    if request.method == 'GET' and not session.get('logged_in'):
         return render_template('index.html')

    else:
        return render_template('main.html', users=users, user=session['username'] )

texts = ["text 1", "text 2", "text 3"]
@app.route("/channel/<string:channel>", methods=['GET'])
def channel(channel):
    return texts[0]


@socketio.on("user login")
def handle_login(users):
    emit("login success", users, broadcast=True)
   
@socketio.on("chat message")
def msg(data):
    chat_message = data["chat_message"]
    usr = data["usr"]
    emit("receive message", {"chat_message": chat_message, "usr": usr}, broadcast=True)

@socketio.on("create channel")
def handle_channels(data):
    channel_name = data["channel_name"]
    emit("channel created", {"channel_name": channel_name}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)

