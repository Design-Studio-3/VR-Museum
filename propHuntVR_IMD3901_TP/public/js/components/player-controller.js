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

            // update the position of the player's body
            spawnedPlayers[i].setAttribute('position',
              data.detail.player.position);

            // calculate the rotation of the player's body
            var playerRotation = new THREE.Euler();
            playerRotation.setFromQuaternion(new THREE.Quaternion(
              data.detail.player.rotation.x,
              data.detail.player.rotation.y,
              data.detail.player.rotation.z
            ));

            // update the rotation of the player's body
            spawnedPlayers[i].object3D.rotation.set(
              0,
              data.detail.player.rotation.y,
              0
            );

            // update the rotation of the player's head
            spawnedPlayers[i].querySelector('.player-head').object3D.rotation.set(
              data.detail.player.rotation.x,
              0,
              0
            );

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
          playerRootEl = document.createElement('a-entity');

          // setup the attributes of the new player element
          playerRootEl.setAttribute('other-player', {
            name: data.detail.player.name
          });
          playerRootEl.setAttribute('id', data.detail.player.id);

          // set the mesh of the player body
          playerRootEl.setAttribute('gltf-model', "#player-body-model");

          // position and rotate the player body
          playerRootEl.setAttribute('position', data.detail.player.position);
          playerRootEl.object3D.quaternion.set(
            0,
            data.detail.player.rotation.y,
            0,
            data.detail.player.rotation.w
          );

          // create the player head
          playerHeadEl = document.createElement('a-entity');
          playerHeadEl.setAttribute('class', "player-head");
          playerHeadEl.setAttribute('gltf-model', "#player-head-model");

          // position and rotate the head
          playerHeadEl.setAttribute('position', "0 2 0");
          playerHeadEl.object3D.quaternion.set(
            data.detail.player.rotation.x,
            0,
            0,
            0
          );

          // append the player head to the player body
          playerRootEl.appendChild(playerHeadEl);

          console.log('Player ' + playerRootEl.getAttribute('id') + ' added.');

          // append the new player element to the players-controller element
          el.appendChild(playerRootEl);
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
