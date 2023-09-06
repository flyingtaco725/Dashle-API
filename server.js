// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const createLobby = require('./functions/createLobby');
const joinLobby = require('./functions/joinLobby')

// Initialize the Express app
const app = express();
// Create an HTTP server using Express
const server = http.createServer(app);
// Initialize Socket.io with the HTTP server
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Define a route to serve the HTML file
app.get('/', (req, res) => {
    // Send the HTML file to the client
    res.sendFile(__dirname + '/index.html');
});

// Listen for any new connections to Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for the 'sendData' event from the client
    socket.on('lobbyCreateSender', async (data) => {
        try {
            let roomkey = await createLobby(data);
            console.log('lobby created');
            console.log(`server.js : ${roomkey}`);
            socket.emit('lobbyCreateResponse', { roomkey: roomkey });
        } catch (error) {
            console.error('Error creating lobby:', error);
        }
    });

    // Listen for the 'sendData' event from the client
    socket.on('lobbyJoinSender', async (data) => {
        // Call the createLobby function with the received data
        try{
            await joinLobby(data);
            console.log('lobby joined')
        }
        catch (error){
            console.error('Error joining lobby')
        }
        
    });

    // Listen for the disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});