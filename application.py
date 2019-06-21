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
channels = {}
general_channel = "General"
general_channel = "Everyone"
channels[general_channel] = general_channel;

@app.route("/")
def index():
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        return main()


    

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
            return render_template('main.html', users=users, channels=channels, user=username)
    if request.method == 'GET' and not session.get('logged_in'):
         return render_template('index.html')

    else:
        return render_template('main.html', users=users, channels=channels, user=session['username'] )


# texts = ["text 1", "text 2", "text 3"]
# @app.route("/main/general")
# def mainchannel():
#     return texts[0]


# @app.route("/main/<string:channel>")
# def channel(channel):
#     return texts[2]

@app.route("/test")
def test():
    return render_template('test.html')

@socketio.on("test_this_shit")
def handle_this_shit(data):
    print(data)
    s = data + "blue"
    emit('my response', s)

# User login receives users, and broadcasts users 
@socketio.on("user login")
def handle_login(users):
    emit("login success", users, broadcast=True)

@socketio.on("update channels")
def handle_login(channeldata):
    emit("broadcast channels", channels, broadcast=True)
   
@socketio.on("chat message")
def msg(data):
    chat_message = data["chat_message"]
    usr = data["usr"]
    emit("receive message", {"chat_message": chat_message, "usr": usr}, broadcast=True)



@socketio.on("create channel")
def handle_channels(data):
    channel_name = data["channel_name"]
    channel_users = ['Todo', 'todo']
    channels[channel_name] = channel_users;
    emit("channel created", {"channel_name": channel_name, "channels": channels}, broadcast=True)
 


@app.route("/<string:channeldata>", methods=['GET'])
def channeldata(channeldata):
    return channeldata





