AFRAME.registerComponent('exhibit',
{
    init: function ()
    {
      
    },

    tick: function ()
    {
      const exhibit = this.el;
      const player = document.querySelector('#camera');

      let exhibitPos = exhibit.getAttribute('position');
      let playerPos = player.getAttribute('position');

      let exhibitPosVector = new THREE.Vector3( exhibitPos.x, exhibitPos.y, exhibitPos.z);
      let playerPosVector = new THREE.Vector3( playerPos.x, playerPos.y, playerPos.z);

      let distanceToExhibit = playerPosVector.distanceTo(exhibitPosVector);

      const screen = document.querySelector('#screen');

      if(distanceToExhibit < 4)
      {
        screen.setAttribute('visible', 'true')
        screen.object3D.lookAt(playerPosVector);
      }

      else
      {
        screen.setAttribute('visible', 'false')
      }

    }
});

