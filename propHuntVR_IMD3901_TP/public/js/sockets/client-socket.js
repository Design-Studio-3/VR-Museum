const socket = io({transports: ['websocket'], upgrade: false});

// received frequently by the server to update the local players database
socket.on('tickUpdate', (data) => {
  console.log("TickUpdate");

  // get the players-controller
  var playersController = document.querySelector('[players-controller]');

  // loop through each player in the data list
  for (var i = 0; i < data.players.length; i++) {
    // don't update the client's player
    if (data.players[i].id != socket.id) {
      // update the current player from the list
      playersController.emit('updatePlayer', {player: data.players[i]});
    }
  }
});

// received at the beginning to get all currently connected players
socket.on('spawnInitialPlayers', (data) => {
  // get the players-controller
  var playersController = document.querySelector('[players-controller]');

  // loop through each player in the data list
  for (var i = 0; i < data.players.length; i++) {
    // make sure the current player is not ourself
    if (data.players[i].id != socket.id) {
      // add the connected player from the list
      playersController.emit('addPlayer', {player: data.players[i]});
    }
  }
});

// received to add a new player on the client side
socket.on('playerJoined', (data) => {
  document.querySelector('[players-controller]').emit(
    'addPlayer', {player: data.player});
});

// received to remove a player on the client side
socket.on('playerQuit', (data) => {
  document.querySelector('[players-controller]').emit(
    'removePlayer', {playerId: data.playerId});
});
