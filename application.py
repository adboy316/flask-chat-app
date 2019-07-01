import os
import requests
import json
import datetime

from flask import Flask, jsonify, render_template, request, flash, session
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_session import Session


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

socketio = SocketIO(app)

""" Global Variables   """

users = []
#  user_profiles = {username:
#                     {'current_channel': 'General'}}
user_profiles = {}
# channels = {'name':
#             {'users': users,
#              'messages': [{}]}}
channels = {'General':
            {'channel_name': 'General',
             'users': users,
             'messages': []}}

""" Routes """

@app.route("/")
def index():
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        return main()

@app.route("/test")
def test():
    return render_template('sidebar.html')
    

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
            new_user = {username:
                        {'current_channel': 'General'}}
            user_profiles.update(new_user)
            return render_template('main.html', users=users, user=session['username'], channels=channels, current_chan="General")
    if request.method == 'GET' and not session.get('logged_in'):
        return render_template('index.html')

    else:

        current_channel = user_profiles[session['username']]
        return render_template('main.html', users=users, channels=channels, user=session['username'], current_channel=current_channel['current_channel'])


@app.route("/<string:channeldata>", methods=['GET'])
def channeldata(channeldata):
    return channeldata


""" Sockets """

# User login receives users, and broadcasts users
@socketio.on("user login")
def handle_login():
    emit("login success", user_profiles, broadcast=True)


@socketio.on("update channels")
def handle_update():
    emit("broadcast channels", channels, broadcast=True)


@socketio.on("chat message")
def msg(data):
    chat_message = data["chat_message"]
    usr = data["usr"]
    chn = data["chn"]

    room = data["chn"]
    timestampStr = datetime.datetime.now().strftime("%d-%b-%Y at %H:%M:")
    join_room(room)

    new_message = {"user": usr, "message": chat_message, "timestamp": timestampStr }
    channels[chn]['messages'].append(new_message)

    emit("receive message", {
         "chat_message": chat_message, "usr": usr}, room=room)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['channel']

    # Chane current channel of user
    user_profiles[username]['current_channel'] = room

    join_room(room)
    # If user not in channel, add user to channel
    if username not in channels[room]['users']:
        channels[room]['users'].append(username)

    channel_info = channels[room]

    emit("update channel data", {
         "channel_info": channel_info, "usr": username}, room=room)


@socketio.on('update messages')
def update_msgs(data):
    room = data['channel']
    join_room(room)
    emit("update channel messages", {
         "all_messages": channels[room]['messages']}) 
        #  changing this to broadcast changes all channels


@socketio.on("create channel")
def handle_channels(data):
    channel_name = data["channel_name"]
    if channels.get(channel_name):
        emit("channel name taken", "Channel name already taken!", broadcast=True)
        return 
               
    channel_users = []
    channel_messages = []

    newchannel = {channel_name:
                  {'channel_name': channel_name,
                   'users': channel_users,
                   'messages': channel_messages}}

    channels.update(newchannel)

    emit("broadcast channels", channels, broadcast=True)
