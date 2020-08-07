// * Dependencies
const express = require('express');

// * creat an app
const app = express();
// * Create a server
const server = require('http').Server(app);

// * Url
app.get('/', (req, res) => {
  res.status(200).send('Hello world\n');
});

// * Listen to a server
server.listen(3030);
