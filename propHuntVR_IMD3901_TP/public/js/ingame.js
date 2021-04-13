// import * as clientSocket from "./sockets/client-socket.js";

// get the parameters passed from index.html (player's name)
var idx = document.URL.indexOf('?');
var params = {},
    pairs = document.URL.split('?').pop().split('&');

for (var i = 0; i < pairs.length; i++) {
  var p = pairs[i].split('=');
  params[p[0]] = p[1];
}

// if the player's parameters have not been provided correctly:
if (params.fname == null) {
  // send the player to the 'something went wrong page'
  window.location.href = "./error.html";
} else {
  // emit the joined event with the player's name
  joinGame(params.fname);
}
