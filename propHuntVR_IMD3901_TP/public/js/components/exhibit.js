import * as database from "../database/data.js";
import * as utils from "../utils/utils.js";

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
        pedestalGeo.setAttribute('static-body', "shape: box");
        el.appendChild(pedestalGeo);
      }

      //
      // GOING TO NEED AN ELSE CASE FOR EXHIBIT COLLIDER WITH NO PEDESTAL
      //

      // create the root screen
      let screenRoot = document.createElement('a-entity');
      screenRoot.setAttribute('id', "screens");
      screenRoot.setAttribute('position', "0 3.0 0");

      // create each screen
      let leftScreen = document.createElement('a-entity');
      leftScreen.setAttribute('id', 'screen-left');
      leftScreen.setAttribute('scale', '1.25 0.4 1');
      leftScreen.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      leftScreen.setAttribute('shadow', {cast: true, receive: true});
      leftScreen.setAttribute('material', {
        src: '../assets/2D/hologramBackground.png', opacity: 0, transparent: true});

      let leftScreenText = document.createElement('a-entity');
      leftScreenText.setAttribute('id', 'screen-left-text');
      leftScreenText.setAttribute('position', '0 0 0.01');
      leftScreenText.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      leftScreenText.setAttribute('material', {
        src: database.exhibitItems[this.data.exhibitId-1].pathToText[0], opacity: 0, transparent: true,
        alphaTest: 0.5});

      let middleScreen = document.createElement('a-entity');
      middleScreen.setAttribute('id', 'screen-middle');
      middleScreen.setAttribute('scale', '1.75 0.55 1');
      middleScreen.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      middleScreen.setAttribute('material', {
        src: '../assets/2D/hologramBackground.png', opacity: 0});
      middleScreen.setAttribute('shadow', {cast: true, receive: true});

      let rightScreen = document.createElement('a-entity');
      rightScreen.setAttribute('id', 'screen-right');
      rightScreen.setAttribute('scale', '1.25 0.4 1');
      rightScreen.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      rightScreen.setAttribute('shadow', {cast: true, receive: true});
      rightScreen.setAttribute('material', {
        src: '../assets/2D/hologramBackground.png', opacity: 0, transparent: true});

      let rightScreenText = document.createElement('a-entity');
      rightScreenText.setAttribute('id', 'screen-right-text');
      rightScreenText.setAttribute('position', '0 0 0.01');
      rightScreenText.setAttribute('geometry', {
        primitive: 'plane', height: 2, radius: 0.5});
      rightScreenText.setAttribute('material', {
        src: database.exhibitItems[this.data.exhibitId-1].pathToText[1], opacity: 0, transparent: true,
        alphaTest: 0.5});

      // add the screens to the scene
      leftScreen.appendChild(leftScreenText);
      rightScreen.appendChild(rightScreenText);
      screenRoot.appendChild(leftScreen);
      screenRoot.appendChild(rightScreen);
      screenRoot.appendChild(middleScreen);
      el.appendChild(screenRoot);

      el.addEventListener('update', function (data) {
        // update isCompleted
        self.data.isCompleted = data.detail.isCompleted;

        // console.log(`isCompleted: ${self.data.isCompleted}`);
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

        if (this.data.enablePedestal == false)
        { 
          // Sensorama only has "Left" text:
          screenLeftText.setAttribute('material', 'color: #00EAFF; opacity:1.0; transparent: true; alphaTest: 0.5' + 'src: ' +  database.exhibitItems[this.data.exhibitId-1].pathToText[0]);

          screens.setAttribute('visible', 'true')
          screenMiddle.setAttribute('animation', 'property: material.opacity; to: 0.75; loop:false; dur:200; easing: linear;')
          screenMiddle.setAttribute('rotation', '0 180 0');
          screenMiddle.setAttribute('position', '-0.017 -0.460 0.372');
          screenMiddle.setAttribute('scale', '1.580 0.620 1.020');

          screenLeftText.setAttribute('rotation', '0 180 0');
          screenLeftText.setAttribute('position', '0 -1.183 0.364');
          screenLeftText.setAttribute('scale', '1.200 1.400 1.000');

          this.el.children[0].setAttribute('static-body', 'shape: box');
        }

        else
        {
          screenLeftText.setAttribute('material', 'color: #00EAFF; opacity:1.0; transparent: true; alphaTest: 0.5' + 'src: ' +  database.exhibitItems[this.data.exhibitId-1].pathToText[0]);
          screenRightText.setAttribute('material', 'color: #00EAFF; opacity:1.0; transparent: true; alphaTest: 0.5'  + 'src: ' +  database.exhibitItems[this.data.exhibitId-1].pathToText[1]);
        }
      }

      else
      {
        prop.setAttribute('visible', "false");
      }

      let timeout;

      if(this.data.enablePedestal == true)
      {

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

          if(this.data.isCompleted)
          {
            screenMiddle.setAttribute('text', "font: roboto; color: #00EAFF; align: center; lineHeight: 100; wrapCount: 12; value:" + database.exhibitItems[this.data.exhibitId-1].name.toUpperCase());
          }

          else
          {
            screenMiddle.setAttribute('text', "font: roboto; color: #00EAFF; align: center; lineHeight: 100; wrapCount: 12; value: EXHIBIT: #" + database.exhibitItems[this.data.exhibitId-1].id + "\n LOCKED");
          }

          screens.object3D.lookAt(playerPosVector.x, playerPosVector.y + 2.25, playerPosVector.z);
        }

        else
        {
          screenMiddle.setAttribute('animation', 'property: material.opacity; to: 0.0; loop:false; dur:200; easing: linear;')
          screenLeft.setAttribute('animation', 'property: material.opacity; to: 0.0; loop:false; dur:200; easing: linear;')
          screenRight.setAttribute('animation', 'property: material.opacity; to: 0.0; loop:false; dur:200; easing: linear;')

          screenLeft.setAttribute('animation__2', 'property: position; to: 0 0 0.75; loop:false; dur:200; easing: linear;')
          screenRight.setAttribute('animation__2', 'property: position; to: 0 0 0.75; loop:false; dur:200; easing: linear;')

          screenLeft.setAttribute('animation__3', 'property: rotation; to: 0 0 0; loop:false; dur:200; easing: linear;')
          screenRight.setAttribute('animation__3', 'property: rotation; to: 0 0 0; loop:false; dur:200; easing: linear;')

          screenLeftText.setAttribute('material', 'opacity:0.0;');
          screenRightText.setAttribute('material', 'opacity:0.0;');

          timeout = setTimeout(function(){ screens.setAttribute('visible', 'false') }, 200);
        }
      }
    }
});
