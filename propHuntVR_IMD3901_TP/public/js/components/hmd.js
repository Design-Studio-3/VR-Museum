AFRAME.registerComponent('hmd', {
    init: function ()
    {
      const hmdComp = this;
      let inView = false;
  
      this.el.addEventListener('click', function()
      {
        if(inView == false)
        {
          inView = true;
  
          // let overlay = document.querySelector('#ui');
          // overlay.setAttribute('style', 'visibility: hidden');
  
          let camera = document.querySelector('#camera');
          camera.removeAttribute('wasd-controls');
          camera.removeAttribute('look-controls');
  
          let camPos = camera.getAttribute('position');
          let xCam = camPos.x;
          let yCam = camPos.y;
          let zCam = camPos.z;
  
          let camRot = camera.getAttribute('rotation');
          let xCamRot = camRot.x;
          let yCamRot = camRot.y;
          let zCamRot = camRot.z;
  
          let objectPos = this.getAttribute('position');
          let xObject = objectPos.x;
          let yObject = objectPos.y;
          let zObject = objectPos.z;
  
          // camera.setAttribute('animation', 'property: position; from: 0 2 0; to: 0 2 -2; loop: false; dur:1000;')
          camera.setAttribute('animation', 'property:position; from: ' + xCam.toString() + ' ' + yCam.toString() + ' ' + zCam.toString() + '; to: ' + xObject.toString() + ' ' + (yObject + 1.5).toString() + ' ' + (zObject+1).toString() +'; loop:false; dur:1500; easing: linear;')
          camera.setAttribute('animation__2', 'property:rotation; from: ' + xCamRot.toString() + ' ' + yCamRot.toString() + ' ' + zCamRot.toString() + '; to: 0 0 0; loop :false; dur:1500; easing: linear;')
  
          hmdComp.el.setAttribute('animation', 'property:position; from: ' + xObject.toString() + ' ' + yObject.toString() + ' ' + zObject.toString() + '; to: ' + xObject.toString() + ' ' + (yObject + 1.5).toString() + ' ' + (zObject).toString() +'; loop:false; dur:1500; easing: linear;')
  
          setTimeout(function()
          {
            let text = document.querySelector('#text');
            text.setAttribute('style', 'visibility: visible');
          }, 1500);
        }
  
        else
        {
          inView = false;
  
          let text = document.querySelector('#text');
          text.setAttribute('style', 'visibility: hidden');
  
          // let overlay = document.querySelector('#ui');
          // overlay.setAttribute('style', 'visibility: visible');
  
          let camera = document.querySelector('#camera');
  
          setTimeout(function()
          {
          camera.setAttribute('wasd-controls', '');
          camera.setAttribute('look-controls', '');
          }, 1500);
  
          let camPos = camera.getAttribute('position');
          let xCam = camPos.x;
          let yCam = camPos.y;
          let zCam = camPos.z;
  
          let objectPos = this.getAttribute('position');
          let xObject = objectPos.x;
          let yObject = objectPos.y;
          let zObject = objectPos.z;
  
          camera.setAttribute('animation', 'property:position; from: ' + xCam.toString() + ' ' + yCam.toString() + ' ' + zCam.toString() + '; to: ' + xObject.toString() + ' 2 ' + (zObject+3).toString() +'; loop:false; dur:1500; easing: linear;')
  
          hmdComp.el.setAttribute('animation', 'property:position; from: ' + xObject.toString() + ' ' + yObject.toString() + ' ' + zObject.toString() + '; to: ' + xObject.toString() + ' ' + (yObject - 1.5).toString() + ' ' + (zObject).toString() +'; loop:false; dur:1500; easing: linear;')
        }
      });
    }
});