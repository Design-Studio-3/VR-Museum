import * as database from "../database/data.js";

console.log(database.exhibitItems);

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
      const player = document.querySelector('#camera');

      let exhibitPos = exhibit.getAttribute('position');
      let playerPos = player.getAttribute('position');

      let exhibitPosVector = new THREE.Vector3( exhibitPos.x, exhibitPos.y, exhibitPos.z);
      let playerPosVector = new THREE.Vector3( playerPos.x, playerPos.y, playerPos.z);

      let distanceToExhibit = playerPosVector.distanceTo(exhibitPosVector);

      const screen = document.querySelector('#screens');

      const screenMiddle = document.querySelector('#screen-middle');
      const screenLeft = document.querySelector('#screen-left');
      const screenRight = document.querySelector('#screen-right');

      const screenText = document.querySelector('#screen-text');

      let timeout;

      console.log()

      if(distanceToExhibit < 4)
      {
        clearTimeout(timeout);

        screen.setAttribute('visible', 'true')

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
          setTimeout(typeWriter, 200);
          oneTime = true;
        }

        let currentText = document.getElementById("demo").innerHTML;
        screenText.setAttribute('text', "value:" + currentText.toString());

        screen.object3D.lookAt(playerPosVector);
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

        timeout = setTimeout(function(){ screen.setAttribute('visible', 'false') }, 200);
      }

    }
});

let i = 0;
let txt = '*** LOCKED ***';
let speed = 50;

function typeWriter()
{
  if (i < txt.length)
  {
    document.getElementById("demo").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
