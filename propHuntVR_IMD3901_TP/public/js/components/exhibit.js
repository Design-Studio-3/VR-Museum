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

      const player = document.querySelector('#rig');

      let exhibitPos = exhibit.getAttribute('position');
      let playerPos = player.getAttribute('position');

      let exhibitPosVector = new THREE.Vector3( exhibitPos.x, exhibitPos.y, exhibitPos.z);
      let playerPosVector = new THREE.Vector3( playerPos.x, playerPos.y, playerPos.z);

      let distanceToExhibit = playerPosVector.distanceTo(exhibitPosVector);

      const prop = exhibit.children[0];

      const screens = exhibit.children[1];

      const screenMiddle = screens.children[0];
      const screenLeft = screens.children[1];
      const screenRight = screens.children[2];
      const screenLeftText = screenLeft.children[0];
      const screenRightText = screenRight.children[0];

      if(this.data.isCompleted)
      {
        prop.setAttribute('visible', "true");
        txt = "STEREOSCOPE";
        screenLeftText.setAttribute('material', 'color: #80e5ff; src: assets/StereoText1.png; opacity:1.0; transparent: true; alphaTest: 0.5');
        screenRightText.setAttribute('material', 'color: #80e5ff; src: assets/StereoText2.png; opacity:1.0; transparent: true; alphaTest: 0.5');
      }

      else
      {
        prop.setAttribute('visible', "false");
        txt = "LOCKED";
      }

      let timeout;

      if(distanceToExhibit < 4)
      {
        clearTimeout(timeout);

        screens.setAttribute('visible', 'true')

        screenMiddle.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')
        screenLeft.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')

        screenLeft.setAttribute('animation__2', 'property: position; to: -1.35 -0.05 0.75; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation__2', 'property: position; to: 1.35 -0.05 0.75; loop:false; dur:200; easing: linear;')

        screenLeft.setAttribute('animation__3', 'property: rotation; to: 0 25 0; loop:false; dur:200; easing: linear;')
        screenRight.setAttribute('animation__3', 'property: rotation; to: 0 -25 0; loop:false; dur:200; easing: linear;')

        if (!oneTime)
        {
          i = 0;
          setTimeout(typeWriter, 300);
          oneTime = true;
        }

        let currentText = document.getElementById("demo").innerHTML;
        screenMiddle.setAttribute('text', "font: roboto; color: #80e5ff; align: center; lineHeight: 200; wrapCount: 12; value:" + currentText.toString());

        screens.object3D.lookAt(playerPosVector.x, playerPosVector.y + 2.25, playerPosVector.z);
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

        screenLeftText.setAttribute('material', 'opacity:0.0;');
        screenRightText.setAttribute('material', 'opacity:0.0;');

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
