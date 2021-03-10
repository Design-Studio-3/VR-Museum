const socket = io({transports: ['websocket'], upgrade: false});

// emitted when this player connects
socket.on('connect', () => {
});

// emitted to update the position of all other players
socket.on('updatePlayers', (data) => {
  // get the players-controller
  var playersController = document.querySelector('[players-controller]');

  // loop through each player in the data list
  for (var i = 0; i < data.players.length; i++) {
    // update the current player from the list
    playersController.emit('updatePlayer', {player: data.players[i]});
  }
});

// emitted at the beginning to get all currently connected players
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

// emitted to add a new player on the client side
socket.on('playerJoined', (data) => {
  document.querySelector('[players-controller]').emit(
    'addPlayer', {player: data.player});
});

// emitted to remove a player on the client side
socket.on('playerQuit', (data) => {
  document.querySelector('[players-controller]').emit(
    'removePlayer', {playerId: data.playerId});
});

// Creates a random hex color
const randomColor = () => {
  return('#' + Math.floor(Math.random() * 16777215).toString(16));
}

// allows for easily getting position as a THREE vector3
const getPosition = (element) => {
  return element.object3D.getWorldPosition(new THREE.Vector3())
    .clone();
}

// allows for easily getting a rotation as a THREE quat
const getRotation = (element) => {
  return element.object3D.getWorldQuaternion(new THREE.Quaternion())
    .clone();
}
