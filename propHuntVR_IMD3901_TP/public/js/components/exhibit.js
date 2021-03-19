let oneTime = false;

AFRAME.registerComponent('exhibit',
{
    schema: {
      isCompleted: {default: false},
      exhibitId: {default: -1}
    },

    init: function ()
    {
      const self = this;
      const el = this.el;

      el.addEventListener('update', function (data) {
        // update isCompleted
        self.data.isCompleted = data.detail.isCompleted;

        console.log(`isCompleted: ${self.data.isCompleted}`);
      });
    },

    tick: function ()
    {
      const exhibit = this.el;
      const player = document.querySelector('#rig');

      let exhibitPos = exhibit.getAttribute('position');
      let playerPos = player.getAttribute('position');

      let exhibitPosVector = new THREE.Vector3( exhibitPos.x, exhibitPos.y, exhibitPos.z);
      let playerPosVector = new THREE.Vector3( playerPos.x, playerPos.y, playerPos.z);

      let distanceToExhibit = playerPosVector.distanceTo(exhibitPosVector);

      const screens = document.querySelector('#screens');

      const screenMiddle = document.querySelector('#screen-middle');
      const screenLeft = document.querySelector('#screen-left');
      const screenRight = document.querySelector('#screen-right');

      let timeout;

      // IF PROP == FOUND:
      // txt = prop.name
      // ELSE
      // txt = "LOCKED"

      if(distanceToExhibit < 4)
      {
        clearTimeout(timeout);

        screens.setAttribute('visible', 'true')

        screenMiddle.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')
        screenLeft.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')

        screenLeft.setAttribute('animation__2', 'property: position; to: -1.25 0 0.75; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation__2', 'property: position; to: 1.25s 0 0.75; loop:false; dur:200; easing: linear;')

        screenLeft.setAttribute('animation__3', 'property: rotation; to: 0 45 0; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation__3', 'property: rotation; to: 0 -45 0; loop:false; dur:200; easing: linear;')

        if (!oneTime)
        {
          i = 0;
          setTimeout(typeWriter, 300);
          oneTime = true;
        }

        let currentText = document.getElementById("demo").innerHTML;
        screenMiddle.setAttribute('text', "font: roboto; color: #80e5ff; align: center; lineHeight: 200; wrapCount: 12; value:" + currentText.toString());

        // IF PROP == FOUND
        screenLeft.setAttribute('text', 'font: roboto; color: #80e5ff; lineHeight: 100; align: center; wrapCount: 25; value:' + " Charles Wheatstone was the first to demonstrate that the brain combines two photographs of the same object taken from different perspectives to create an image with depth. He used this knowledge to create the first stereoscope. ");
        screenRight.setAttribute('text', 'font: roboto; color: #80e5ff; lineHeight: 100; align: center; wrapCount: 25; value:' + " Charles Wheatstone was the first to demonstrate that the brain combines two photographs of the same object taken from different perspectives to create an image with depth. He used this knowledge to create the first stereoscope. ");

        screens.object3D.lookAt(playerPosVector.x, playerPosVector.y + 2, playerPosVector.z);
      }

      else
      {
        oneTime = false;

        screenMiddle.setAttribute('animation', 'property: material.opacity; to: 0.0; loop:false; dur:200; easing: linear;')
        screenLeft.setAttribute('animation', 'property: material.opacity; to: 0.0; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation', 'property: material.opacity; to: 0.0; loop:false; dur:200; easing: linear;')

        screenLeft.setAttribute('animation__2', 'property: position; to: 0 0 0.75; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation__2', 'property: position; to: 0 0 0.75; loop:false; dur:200; easing: linear;')

        screenLeft.setAttribute('animation__3', 'property: rotation; to: 0 0 0; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation__3', 'property: rotation; to: 0 0 0; loop:false; dur:200; easing: linear;')

        document.getElementById("demo").innerHTML = "";
        screenLeft.removeAttribute('text');
        screenRight.removeAttribute('text');

        timeout = setTimeout(function(){ screens.setAttribute('visible', 'false') }, 200);
      }

    }
});

let i = 0;
let txt = "LOCKED";
let speed = 100;

function typeWriter()
{
  if (i < txt.length)
  {
    document.getElementById("demo").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
