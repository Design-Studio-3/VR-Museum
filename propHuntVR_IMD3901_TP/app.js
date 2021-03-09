const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const io        = require('socket.io')(server);

const LISTEN_PORT = 8080;
server.listen(LISTEN_PORT);
app.use(express.static(__dirname + '/public')); //set root path of server ...
console.log("Listening on port: " + LISTEN_PORT );

// this is call a "route" - basically a url path from your website for static
// pages
app.get( '/', function( req, res ){
    res.sendFile( __dirname + '/public/index.html' );
});

// players database
var players = [];

// set up socket.io session
io.on('connection', (socket) => {
  // when this client connects
  onConnect(socket);

  // when this client disconnects
  socket.on('disconnect', (reason) => {
    onDisconnect(socket);
  });

  // when this client moves or rotates
  socket.on('moved', (data) => {
    // get the player index
    const playerIndex = getPlayerIndex(socket.id);

    // update the position and rotation of the player in the database
    players[playerIndex].position = data.newPosition;
    players[playerIndex].rotation = data.newRotation;

    // emit the updatePlayers event to all connected clients
    socket.broadcast.emit('updatePlayers', {players: players});
  });
});

// returns the index of a player in the database, or -1 if not found
const getPlayerIndex = (id) => {
  // loop through each player in the database
  for (var i = 0; i < players.length; i++) {
    if (players[i].id == id) {
      return i;
    }
  }

  // the player wasn't found, return -1
  return -1;
}

// to be called when a new client connects
const onConnect = (socket) => {
  // create the new player
  var newPlayer = {
    id: socket.id,
    name: '',
    position: {x:0, y:0, z:0},
    rotation: {x:0, y:0, z:0, w:0}
  };

  // add the new client id to the list of connections
  players.push(newPlayer);

  // log the player that was added to the list (and all players)
  console.log('Connection %s added.', socket.id);
  console.log('Connections: (%s)', players.length);
  console.log(players);

  // emit the spawnInitialPlayers event to this socket
  socket.emit('spawnInitialPlayers', {players: players});

  // emit the playerJoined event to all connected sockets
  socket.broadcast.emit('playerJoined', {player: newPlayer});
}

// to be called when a client disconnects
const onDisconnect = (socket) => {
  // get the id of the player to disconnect
  var indexOfPlayer = getPlayerIndex(socket.id);

  // remove the client's id from the list of connections
  players.splice(indexOfPlayer, 1);

  // log which player was removed and the players left
  console.log('Connection %s removed.', socket.id);
  console.log('Connections: (%s)', players.length);
  console.log(players);

  // invoke the playerQuit event to all connected clients
  io.emit('playerQuit', {playerId: socket.id});
}
