// Local imports
import * as utils from './public/js/utils/utils.js';

// Library Imports
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialization
const app       = express();
const server    = http.createServer(app);
const io        = new Server(server);

// Configuration variables
const LISTEN_PORT     = 8080;
const logLevel        = utils.LogLevel.Some;
const updateInterval  = 50;

server.listen(LISTEN_PORT);
app.use(express.static(__dirname + '/public')); //set root path of server ...
console.log("Listening on port: " + LISTEN_PORT );

// this is call a "route" - basically a url path from your website for static
// pages
app.get( '/', function( req, res )
{
    res.sendFile( __dirname + '/public/index.html' );
});

// players database
var players = [];

// game variables
var currentExhibitItemId  = 1;
var piecesFound           = [];
var numOfPieces           = -1;

// set up socket updater timer
var socketUpdateTime = setInterval(updateSockets, updateInterval);

function updateSockets()
{
  // do logging
  if (logLevel == utils.LogLevel.Verbose)
  {
    console.log('Updating clients.');
  }

  // send the tick update to all clients
  io.emit('tickUpdate',
  {
    players: players,
    currentExhibitItemId: currentExhibitItemId,
    piecesFound: piecesFound
  });
}

// used to advance to the next exhibit item
function goToNextExhibitItem()
{
  // get the number of exhibit items

  // only advance if there are more exhibitItems to go through

    // increment the currentExhibitItemId
    currentExhibitItemId++;

    // get the number of pieces for this exhibit item from the database

    // clear pieces found
    piecesFound = [];
}

// set up socket.io session
io.on('connection', (socket) =>
{
  // when this client connects
  onConnect(socket);

  // when this client disconnects
  socket.on('disconnect', (reason) =>
  {
    onDisconnect(socket);
  });

  // when this client moves or rotates
  socket.on('moved', (data) =>
  {
    // get the player index
    const playerIndex = getPlayerIndex(socket.id);

    // update the position and rotation of the player in the database
    players[playerIndex].position = data.newPosition;
    players[playerIndex].rotation = data.newRotation;
  });
});

// returns the index of a player in the database, or -1 if not found
const getPlayerIndex = (id) =>
{
  // loop through each player in the database
  for (var i = 0; i < players.length; i++)
  {
    if (players[i].id == id)
    {
      return i;
    }
  }

  // the player wasn't found, return -1
  return -1;
}

// to be called when a new client connects
const onConnect = (socket) =>
{
  // create the new player
  var newPlayer =
  {
    id: socket.id,
    name: '',
    position: {x:0, y:0, z:0},
    rotation: {x:0, y:0, z:0, w:0}
  };

  // add the new client id to the list of connections
  players.push(newPlayer);

  // do logging
  switch (logLevel)
  {
    case utils.LogLevel.Some:
      // log the player that was added
      console.log('Connection %s added.', socket.id);
      break;

    case utils.LogLevel.Verbose:
      // log the player that was added to the list (and all players)
      console.log('Connection %s added.', socket.id);
      console.log('Connections: (%s)', players.length);
      console.log(players);
      break;
  }

  // emit the playerJoined event to all connected sockets
  socket.broadcast.emit('playerJoined', {player: newPlayer});
}

// to be called when a client disconnects
const onDisconnect = (socket) =>
{
  // get the id of the player to disconnect
  var indexOfPlayer = getPlayerIndex(socket.id);

  // remove the client's id from the list of connections
  players.splice(indexOfPlayer, 1);

  // do logging
  switch (logLevel)
  {
    case utils.LogLevel.Some:
      // log which player was removed
      console.log('Connection %s removed.', socket.id);
      break;

    case utils.LogLevel.Verbose:
      // log which player was removed and the players left
      console.log('Connection %s removed.', socket.id);
      console.log('Connections: (%s)', players.length);
      console.log(players);
      break;
  }

  // invoke the playerQuit event to all connected clients
  io.emit('playerQuit', {playerId: socket.id});
}
