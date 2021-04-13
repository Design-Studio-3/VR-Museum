// the OtherPlayer component (created to visualize other connected players)
AFRAME.registerComponent('other-player', {
    schema: {
      name: {type: 'string', default: ''},
      color: {type: 'color', default: 'grey'}
    },
    init: function () {
      // add the name tag to the other player
      var nameTag = document.createElement('a-entity');
      nameTag.setAttribute('text', {
        value: this.data.name,
        align: "center",
        width: 15,
        wrapCount: 100
      });
      nameTag.setAttribute('class', 'nameTag');
      nameTag.setAttribute("position", "0 2.9 0");
      this.el.appendChild(nameTag);
    },
    tick: function () {
      // find the player
      const player = document.querySelector('#rig');
      var playerPosition = player.getAttribute('position');
      var playerPosVector = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);

      const nameTag = this.el.querySelector('.nameTag');
      nameTag.object3D.lookAt(playerPosVector.x, playerPosVector.y + 2.25, playerPosVector.z);
    }
  });
