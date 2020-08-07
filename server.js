// * Dependencies
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// * creat an app
const app = express();
// * Create a server
const server = require('http').Server(app);

// * Specify a default engine
app.set('view engine', 'ejs');
// * Specify the public folder
app.use(express.static('public'));

// * Url
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// * Create a uuid for the room
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});
// * Listen to a server
server.listen(3030);
