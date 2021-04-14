// Local imports
import * as utils from './public/js/utils/utils.js';
import * as database from './public/js/database/data.js';

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
var currentExhibitItemIndex = -1;
var currentExhibitItemId    = -1;
var partsFound              = [];
var numOfParts              = -1;
var completedExhibitIds     = [];
var gameOver                = false;

// set up socket updater timer
var socketUpdateTime = setInterval(updateSockets, updateInterval);

// Run the server's startup method
startup();

// Run on server startup
function startup()
{
  // set the starting exhibitItemIndex
  currentExhibitItemIndex = 0;

  // initialize variables
  players = [];
  currentExhibitItemId = database.exhibitItems[currentExhibitItemIndex].id;
  partsFound = [];
  numOfParts = database.exhibitItems[currentExhibitItemIndex].numOfParts;
  completedExhibitIds = [];
  gameOver = false;
}

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
    partsFound: partsFound,
    completedExhibitIds: completedExhibitIds
  });
}

// used to advance to the next exhibit item
function goToNextExhibitItem()
{
  // only advance if there are more exhibitItems to go through
  if (currentExhibitItemIndex + 1 < database.exhibitItems.length)
  {
    // increment the currentExhibitItemId
    currentExhibitItemIndex++;

    // get the new exhibit item information
    currentExhibitItemId = database.exhibitItems[currentExhibitItemIndex].id;
    numOfParts = database.exhibitItems[currentExhibitItemIndex].numOfParts;

    // clear pieces found
    partsFound = [];

    // emit for the UI
    io.emit('updateUIExhibits', {
      currentExhibitItemId: currentExhibitItemId,
      partsFound: partsFound,
      allPartsFoundBool: 'True',
      gameOver: gameOver
    });
    io.emit('updateUIMessage', {
      message: 'All parts have been found! Proceed to next exhibit item'
    });
    io.emit('makeANoise', {
      sound: 'finishedExhibit'
    });

    // do logging
    switch (logLevel)
    {
      case utils.LogLevel.Verbose && utils.LogLevel.Some:
        console.log(
          `Proceeding to next exhibit item:
          id:${currentExhibitItemId},
          name: ${database.exhibitItems[currentExhibitItemIndex].name},
          numOfParts:${numOfParts}`);
    }
  } else {
    // Game is over!
    gameOver = true;
    io.emit('updateUIExhibits', {
      currentExhibitItemId: -1,
      partsFound: [],
      allPartsFoundBool: 'True',
      gameOver: gameOver
    });
    io.emit('updateUIMessage', {message: 'Congrats! All exhibits have been completed!'});
    io.emit('makeANoise', {sound: 'finishedMuseum'});
  }
}

// used to check if the current exhibit has been completed
function tryCompleteExhibit()
{
  // check if all the parts have been found
  if (partsFound.length == numOfParts)
  {
    // complete the exhibit
    forceCompleteExhibit();
  }
}

function forceCompleteExhibit() {
  // add this exhibit id to the list of completed exhibits
  completedExhibitIds.push(currentExhibitItemId);

  // advance to the next exhibit item
  goToNextExhibitItem();
}

// set up socket.io session
io.on('connection', (socket) =>
{
  var joined = false;

  socket.on('joinGame', (data) => {
    // when this client connects
    onConnect(socket, data);

    joined = true;
  });

  // when this client disconnects
  socket.on('disconnect', (reason) =>
  {
    if (joined)
    {
      onDisconnect(socket);
    }
  });

  // when this client moves or rotates
  socket.on('moved', (data) =>
  {
    // get the player index
    const playerIndex = getPlayerIndex(socket.id);

    if (playerIndex == -1)
    {
      console.log("onMove: Cannot find player with id: %s", socket.id);
    }
    else
    {
      // update the position and rotation of the player in the database
      players[playerIndex].position = data.newPosition;
      players[playerIndex].rotation = data.newRotation;
    }
  });

  // when the client finds an exhibit item part
  socket.on('partFound', (data) => {
    // ensure that this part is for the current exhibit item and hasn't already
    // been found
    if (data.itemId == currentExhibitItemId && !partsFound.includes(data.partNumber))
    {
      // do logging
      switch (logLevel)
      {
        case utils.LogLevel.Verbose && utils.LogLevel.Some:
        console.log(`Part ${data.partNumber} found,` +
          ` ${numOfParts - partsFound.length} left.`);
      }

      // add the part to the list of found parts
      partsFound.push(data.partNumber);

      // emit for the UI
      io.emit('updateUIExhibits', {
        currentExhibitItemId: currentExhibitItemId,
        partsFound: partsFound,
        allPartsFoundBool: 'False',
        gameOver: gameOver
      });
      io.emit('updateUIMessage', {
        message: 'A part of the exhibit item has been found'
      });
      io.emit('makeANoise', {
        sound: 'ding'
      });

      // check if the exhibit has been completed
      tryCompleteExhibit();
    } else {
      io.emit('updateUIMessage', {
        message: 'This is not the part you\'re looking for. Try something else!'
      });
      io.emit('makeANoise', {
        sound: 'wrong exhibit'
      });
    }
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
const onConnect = (socket, playerData) =>
{
  // create the new player
  var newPlayer =
  {
    id: socket.id,
    name: playerData.name,
    position: {x:0, y:0, z:0},
    rotation: {x:0, y:0, z:0}
  };

  // add the new client id to the list of connections
  players.push(newPlayer);

  // emit the playerJoined event to all connected sockets
  socket.broadcast.emit('playerJoined', {player: newPlayer});

  // do logging
  switch (logLevel)
  {
    case utils.LogLevel.Some:
    // log the player that was added
    console.log('Connection %s (%s) added.', socket.id, playerData.name);
    break;

    case utils.LogLevel.Verbose:
    // log the player that was added to the list (and all players)
    console.log('Connection %s (%s) added.', socket.id, playerData.name);
    console.log('Connections: (%s)', players.length);
    console.log(players);
    break;
  }

  // emit for the UI, displays which exhibit parts have been found
  socket.emit('updateUIExhibits', {
    currentExhibitItemId: currentExhibitItemId,
    partsFound: partsFound,
    gameOver: gameOver
  });
  // update UI message
  io.emit('updateUIMessage', {
    message: 'Player ' + newPlayer.name + ' has joined'
  });

  // emit the playerJoined event to all connected sockets
  socket.broadcast.emit('playerJoined', {player: newPlayer});
}

// to be called when a client disconnects
const onDisconnect = (socket) =>
{
  console.log(socket.id);

  // get the id of the player to disconnect
  var indexOfPlayer = getPlayerIndex(socket.id);
  var playerName = players[indexOfPlayer].name;

  // remove the client's id from the list of connections
  players.splice(indexOfPlayer, 1);

  // update UI message
  io.emit('updateUIMessage', {
    message: 'Player ' + playerName + ' has left'
  });

  // invoke the playerQuit event to all connected clients
  io.emit('playerQuit', {playerId: socket.id});

  // do logging
  switch (logLevel)
  {
    case utils.LogLevel.Some:
    // log which player was removed
    console.log('Connection %s (%s) removed.', socket.id, playerName);
    break;

    case utils.LogLevel.Verbose:
    // log which player was removed and the players left
    console.log('Connection %s (%s) removed.', socket.id, playerName);
    console.log('Connections: (%s)', players.length);
    console.log(players);
    break;
  }
}
