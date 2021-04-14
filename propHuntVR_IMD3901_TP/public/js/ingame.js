// import * as clientSocket from "./sockets/client-socket.js";

// get the parameters passed from index.html (player's name)
var idx = document.URL.indexOf('?');
var params = {},
    pairs = document.URL.split('?').pop().split('&');

for (var i = 0; i < pairs.length; i++) {
  var p = pairs[i].split('=');
  params[p[0]] = p[1];
}

var playerName = params.fname;
playerName = playerName.replace(/\+/g, " ");
console.log(playerName);

// if the player's parameters have not been provided correctly:
if (playerName == null) {
  // send the player to the 'something went wrong page'
  window.location.href = "./error.html";
} else {
  // emit the joined event with the player's name
  joinGame(playerName);

  // start the music, oh yeah
  var audio = new Audio("./assets/audio/music.m4a");
  audio.loop = true;
  audio.volume = 0.1;
  audio.play();
}
