const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Handle incoming socket connections
io.on('connection', socket => {
    //console.log(`New client connected: ${socket.id}`);

    // Listen for incoming chat messages
    socket.on('chat message', message => {
       // console.log(`New message from ${socket.id}: ${message}`);

        // Broadcast the message to all connected clients
        io.emit('chat message', { id: socket.id, message });
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server started on port 3000');
});
