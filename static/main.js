document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', function () {

    /* Update all existing users on connection  */
    socket.emit('user login', { 'users': online_users });
// * Update all existing channels on connection * /
    // Oh shit, this has to do with the form_new_channel div
    socket.emit('update channels', { 'chann': form_new_channel })


  });


  /* Event listeneres */

  /*  Form submission emits a "chat message" event */
  $(function () {
    $('#chat').submit(function (e) {
      e.preventDefault(); // prevents page reloading
      const chat_message = $('#m').val();
      var usr = document.querySelector('#messages').dataset.user;
      socket.emit('chat message', { 'chat_message': chat_message, 'usr': usr });
      $('#m').val('');
      return false;
    });
  });

  /*  Channel creation */
  $(function () {
    $('#channel_form').submit(function (e) {
      e.preventDefault(); // prevents page reloading
      const channel_name = $('#channel_name').val();
      socket.emit('create channel', { 'channel_name': channel_name });
      $('#channel_name').val('');
      return false;
    });
  });

  /* Socket handlers */
  socket.on('broadcast channels', data => {
    clearBox("nav");

    for (var key in data) {
      // do something with "key" and "value" variables
      var li = document.createElement('li');
      var newlink = document.createElement('a');

      newlink.setAttribute('href', "#");
      newlink.classList.add("nav-link");
      newlink.setAttribute("id", "nav-link");
      newlink.dataset.page = key;

      newlink.title = key;
      // newlink.onclick= load_page("hey");
      li.appendChild(newlink);
      newlink.innerHTML = key;
      document.querySelector('#nav').append(li);
    }
  });

  /* When a new message is announced, add to the unordered list #messages */
  socket.on('receive message', data => {
    const li = document.createElement('li');
    li.innerHTML = `${data.usr}  : ${data.chat_message}`;
    document.querySelector('#messages').append(li);
  });

  socket.on('login success', data => {
    const li = document.createElement('li');
    li.innerHTML = `Users Online: ${data.users}`;
    $("#online_users").html(li)
  });


  socket.on('channel created', data => {
    var li = document.createElement('li');
    var newlink = document.createElement('a');
    newlink.href = "#"
    newlink.classList.add("nav-link");
    newlink.dataset.page = `${data.channel_name}`;
    newlink.setAttribute("id", "nav-link");

    // newlink.title = `${data.channel_name}`;
    //newlink.onclick= load_page("hey");

    li.appendChild(newlink);
    newlink.innerHTML = `${data.channel_name}`;
    document.querySelector('#nav').append(li);
    window.location.reload(true);

  });


});



/* Functions */
function clearBox(elementID) {
  document.getElementById(elementID).innerHTML = "";
}

// Renders contents of new page in main view.
function load_page(name) {
  const request = new XMLHttpRequest();
  request.open('GET', `/${name}`);
  request.onload = () => {
    const response = request.responseText;
    document.querySelector('#channel-content').innerHTML = response;

    const li = document.createElement('li');
    li.innerHTML = channeldata[name];
    document.querySelector('#channel-content').append(li);
  };
  request.send();
}


// // Listen for enter key, and send message when pressed
// function enterKeyListener() {
//   var input = document.getElementById("msg");
//   // Execute a function when the user releases a key on the keyboard
//   input.addEventListener("keyup", function (event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.keyCode === 13) {
//       // Cancel the default action, if needed
//       event.preventDefault();
//       // Trigger the button element with a click
//       document.getElementById("button").click();
//     }
//   });
// }

