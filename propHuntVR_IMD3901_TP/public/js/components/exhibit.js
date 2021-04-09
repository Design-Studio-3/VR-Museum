import * as database from "../database/data.js";
import * as utils from "../utils/utils.js";

let oneTime = false;

AFRAME.registerComponent('exhibit',
{
    schema: {
      isCompleted: {default: false},
      exhibitId: {default: -1},
      enablePedestal: {default: true}
    },

    init: function ()
    {
      const self = this;
      const el = this.el;

      // create the geometry for the exhibit item
      let exhibitItemGeo = document.createElement('a-entity');
      exhibitItemGeo.setAttribute('gltf-model',
        utils.getExhibitById(this.data.exhibitId).pathToFullAsset);
      exhibitItemGeo.setAttribute('visible', 'false');
      exhibitItemGeo.setAttribute('shadow', {
        cast: true,
        receive: true
      });
      exhibitItemGeo.setAttribute('class', 'exhibitItem');

      // place the exhibit item on the pedestal if there is one
      if (this.data.enablePedestal)
      {
        exhibitItemGeo.setAttribute('position', "0 1.8 0");
      }

      // add the exhibit item geometry to the scene
      el.appendChild(exhibitItemGeo);

      // create the pedestal geometry if enabled
      if (this.data.enablePedestal)
      {
        let pedestalGeo = document.createElement('a-entity');
        pedestalGeo.setAttribute('gltf-model', "#pedestal-model");
        el.appendChild(pedestalGeo);
      }

      // create the root screen
      let screenRoot = document.createElement('a-entity');
      screenRoot.setAttribute('id', "screens");
      screenRoot.setAttribute('position', "0 2.8 0");

      // create each screen
      let leftScreen = document.createElement('a-entity');
      leftScreen.setAttribute('id', 'screen-left');
      leftScreen.setAttribute('scale', '1.25 0.4 1');
      leftScreen.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      leftScreen.setAttribute('shadow', {cast: true, receive: true});
      leftScreen.setAttribute('material', {
        src: '../assets/holo.png', opacity: 0, transparent: true});

      let leftScreenText = document.createElement('a-entity');
      leftScreenText.setAttribute('id', 'screen-left-text');
      leftScreenText.setAttribute('position', '0 0 0.01');
      leftScreenText.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      leftScreenText.setAttribute('material', {
        src: '../assets/StereoText1.png', opacity: 0, transparent: true,
        alphaTest: 0.5});

      let middleScreen = document.createElement('a-entity');
      middleScreen.setAttribute('id', 'screen-middle');
      middleScreen.setAttribute('scale', '1.75 0.55 1');
      middleScreen.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      middleScreen.setAttribute('material', {
        src: '../assets/holo.png', opacity: 0});
      middleScreen.setAttribute('shadow', {cast: true, receive: true});

      let middleScreenText = document.createElement('p');
      middleScreenText.setAttribute('id', 'demo');

      let rightScreen = document.createElement('a-entity');
      rightScreen.setAttribute('id', 'screen-right');
      rightScreen.setAttribute('scale', '1.25 0.4 1');
      rightScreen.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      rightScreen.setAttribute('shadow', {cast: true, receive: true});
      rightScreen.setAttribute('material', {
        src: '../assets/holo.png', opacity: 0, transparent: true});

      let rightScreenText = document.createElement('a-entity');
      rightScreenText.setAttribute('id', 'screen-right-text');
      rightScreenText.setAttribute('position', '0 0 0.01');
      rightScreenText.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      rightScreenText.setAttribute('material', {
        src: '../assets/StereoText1.png', opacity: 0, transparent: true,
        alphaTest: 0.5});

      // add the screens to the scene
      leftScreen.appendChild(leftScreenText);
      middleScreen.appendChild(middleScreenText);
      rightScreen.appendChild(rightScreenText);
      screenRoot.appendChild(leftScreen);
      screenRoot.appendChild(rightScreen);
      screenRoot.appendChild(middleScreen);
      el.appendChild(screenRoot);

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

      const prop = exhibit.querySelector('.exhibitItem');

      const screens = exhibit.querySelector('#screens');
      const screenMiddle = screens.querySelector('#screen-middle');
      const screenLeft = screens.querySelector('#screen-left');
      const screenRight = screens.querySelector('#screen-right');
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
