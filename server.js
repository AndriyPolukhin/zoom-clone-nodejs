// * Dependencies
const express = require('express');
// * create an app
const app = express();
// * Create a server
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
// * Peer server
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// * Specify a default engine
app.set('view engine', 'ejs');
// * Specify the public folder
app.use(express.static('public'));

// * Specify the peer
app.use('/peerjs', peerServer);

// * Url
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// * Create a uuid for the room
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// * Init the socket connection
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    console.log(`Joined room: ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message);
    });
  });
});

// * Listen to a server
server.listen(3030);
