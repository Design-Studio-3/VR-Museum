// The PlayerController component (creates, removes, and updates other
  // players who have joined)
  AFRAME.registerComponent('players-controller', {
    init: function () {
      var el = this.el;

      el.addEventListener('updatePlayer', function (data) {
        // get each spawned player
        var spawnedPlayers = document.querySelectorAll('[other-player]');

        // loop through each spawned player
        for (var i = 0; i < spawnedPlayers.length; i++) {
          // check if the current spawned player should be updated (by id)
          if (spawnedPlayers[i].getAttribute('id') ==
            data.detail.player.id)
          {
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
      });

      el.addEventListener('addPlayer', function (data) {
        // create a new entity element
        playerEl = document.createElement('a-entity');

        // setup the attributes of the new player element
        playerEl.setAttribute('other-player', {
          name: data.detail.player.name
        });
        playerEl.setAttribute('id', data.detail.player.id);
        playerEl.setAttribute('position', data.detail.player.position);

        playerEl.object3D.quaternion.set(
          data.detail.player.rotation.x,
          data.detail.player.rotation.y,
          data.detail.player.rotation.z,
          data.detail.player.rotation.w
        )

        console.log('Player ' + playerEl.getAttribute('id') + ' added.');

        // append the new player element to the players-controller element
        el.appendChild(playerEl);
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
    }
  });