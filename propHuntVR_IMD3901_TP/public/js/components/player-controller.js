// The PlayerController component (creates, removes, and updates other
  // players who have joined)
  AFRAME.registerComponent('players-controller', {
    init: function () {
      var self = this;
      var el = this.el;

      el.addEventListener('updatePlayer', function (data) {
        // get each spawned player
        var spawnedPlayers = document.querySelectorAll('[other-player]');

        var playerFound = false;

        // loop through each spawned player
        for (var i = 0; i < spawnedPlayers.length; i++) {
          // check if the current spawned player should be updated (by id)
          if (spawnedPlayers[i].getAttribute('id') ==
            data.detail.player.id)
          {
            // indicate that the player was found
            playerFound = true;

            // update the position of the player
            spawnedPlayers[i].setAttribute('position',
              data.detail.player.position);

            // update the rotatino of the player
            spawnedPlayers[i].object3D.quaternion.set(
              data.detail.player.rotation.x,
              data.detail.player.rotation.y,
              data.detail.player.rotation.z,
              data.detail.player.rotation.w
            )

            // update the other-player data of the player
            spawnedPlayers[i].setAttribute('other-player', {
              name: data.detail.player.name
            });
          }
        }

        // if the player was not found, create the player
        if (!playerFound) {
          el.emit('addPlayer', {player: data.detail.player});
        }
      });

      el.addEventListener('addPlayer', function (data) {
        // make sure that the player does not already exist
        if (!self.playerIsSpawned(data.detail.player.id)) {
          // create a new entity element
          playerEl = document.createElement('a-entity');

          // setup the attributes of the new player element
          playerEl.setAttribute('other-player', {
            name: data.detail.player.name
          });
          playerEl.setAttribute('gltf-model', "#player-model");
          playerEl.setAttribute('id', data.detail.player.id);
          playerEl.setAttribute('position', data.detail.player.position);

          playerEl.object3D.quaternion.set(
            data.detail.player.rotation.x,
            data.detail.player.rotation.y,
            data.detail.player.rotation.z,
            data.detail.player.rotation.w
          );

          console.log('Player ' + playerEl.getAttribute('id') + ' added.');

          // append the new player element to the players-controller element
          el.appendChild(playerEl);
        }
      });

      el.addEventListener('removePlayer', function (data) {
        // get each spawned player
        var spawnedPlayers = document.querySelectorAll('[other-player]');

        // loop through each spawned player
        for (let i = 0; i < spawnedPlayers.length; i++) {
          // check if the current spawned player should be removed (by id)
          if (spawnedPlayers[i].getAttribute('id') ==
            data.detail.playerId)
          {
            console.log('Player ' + spawnedPlayers[i].getAttribute('id')
              + ' removed.');

            // remove the spawned player
            spawnedPlayers[i].parentNode.removeChild(spawnedPlayers[i]);
          }
        }
      });
    },

    playerIsSpawned: function (playerId) {
      // get currently spawned players
      var spawnedPlayers = document.querySelectorAll('[other-player]');

      // loop through each player
      for (var i = 0; i < spawnedPlayers.length; i++) {
        if (spawnedPlayers[i].getAttribute('id') == playerId) {
          // the player was found, return true
          return true;
        }
      }

      // the player was not found, return false
      return false;
    }
  });
