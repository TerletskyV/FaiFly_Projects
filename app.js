const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;
const messages = [];

//Serving static content
app.use(express.static(__dirname + '/public'));

//Handle connection socket.io event
io.on('connection', (socket) => {
    //Send all messages to the new user
    messages.forEach((message) => {
        socket.emit('chat message', message);
    });

    socket.on('chat message', (message) => {
        //Adding users message to a storage
        messages.push(message);
        // Send a message to all users
        io.emit('chat message', message);
    });
});

//Start server
http.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});