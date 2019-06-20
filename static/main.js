document.addEventListener('DOMContentLoaded', () => {

  

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', function(){

    /* Adds user to users online list  */
    console.log(online_users);
    socket.emit('user login', {'users': online_users});
    socket.on('login success', data => {
      const li = document.createElement('li');
      li.innerHTML = `Users Onlne: ${data.users}`;
      $("#online_users").html(li)
  });
    
     /*  Form submission emits a "chat message" event */
    $(function () {
      $('#chat').submit(function(e){
        e.preventDefault(); // prevents page reloading
        const chat_message = $('#m').val();
        var usr = document.querySelector('#messages').dataset.user;
        socket.emit('chat message', {'chat_message': chat_message, 'usr': usr});
        $('#m').val('');
        return false;
      });
    });

     /*  Channel creation */
     $(function () {
      $('#channel_form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        const channel_name = $('#channel_name').val();
        socket.emit('create channel', {'channel_name': channel_name});
        $('#channel_name').val('');
        return false;
      });
    });



    /* When a new message is announced, add to the unordered list #messages */
    socket.on('receive message', data => {
      const li = document.createElement('li');
      li.innerHTML = `${data.usr}  : ${data.chat_message}`;
      document.querySelector('#messages').append(li);
  });


  socket.on('channel created', data => {
    var li = document.createElement('li');
    var newlink = document.createElement('a');
    
    newlink.title = `${data.channel_name}`;
    newlink.href = "http://example.com";
    li.appendChild(newlink);
    newlink.innerHTML = `${data.channel_name}`;
    document.querySelector('#channel_list').append(li);
});

    // socket.on('disconnect', function(){
    //   console.log('user disconnected');
    // });

  
   


    // Create room links in html
    // When those links are clicked, chat space changes 



  });

 



});


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

