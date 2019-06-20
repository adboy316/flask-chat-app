document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Each button should emit a "submit vote" event
        document.querySelectorAll('button').forEach(button => {
            button.onclick = () => {
                const data = "button.dataset.vote;"
                socket.emit('track users', {'data': data});
            };
        });
    });

    // When a new vote is announced, add to the unordered list
    socket.on('tell users', data => {
    
        console.log('hello');
        
    });
});