document.addEventListener('DOMContentLoaded', () => {

  

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  
    socket.on('connect', function(){

      
  
      $(function () {
        $('#loginform').submit(function(e){
          
          const selection = $('#username').val();
          socket.emit('user login', {'selection': selection});
          $('#m').val('');
          return false;
        });
      });
      
    
  
      
    //   socket.on('receive message', data => {
    //     console.log(data.selection);
    //     // const li = document.createElement('li');
    //     // li.innerHTML = `Username goes here: ${data.selection}`;
    //     // document.querySelector('#messages').append(li);
    // });
  
  
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
  
  