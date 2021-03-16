// require('../utils/utils.js');
// import * as utils from '../utils/utils.js';
// var utils = import('../utils/utils.js');

// allows for easily getting position as a THREE vector3
const getPosition = (element) => {
  return element.object3D.getWorldPosition(new THREE.Vector3())
    .clone();
};

const getRotation = (element) => {
// allows for easily getting a rotation as a THREE quat
  return element.object3D.getWorldQuaternion(new THREE.Quaternion())
    .clone();
};

AFRAME.registerComponent('player', {
    schema: {
      moveThreshold: {type:'number', default: 0.1},
      rotationThreshold: {type: 'number', default: 0.1}
    },
    init: function() {
      // set up initial vars
      this.lastPosition = getPosition(this.el);
      this.lastRotation = getRotation(this.el);
    },

    tick: function() {
      var newPosition = getPosition(this.el);
      var newRotation = getRotation(this.el);

      // check if the player has moved more than the threshold amount
      if (this.hasMoved(newPosition) || this.hasRotated(newRotation)) {
        // emit a moved event to the server with the new position
        socket.emit('moved', {
          newPosition:
          {x: newPosition.x, y: newPosition.y, z: newPosition.z},
          newRotation:
          {x: newRotation.x, y: newRotation.y, z: newRotation.z,
            w: newRotation.w}});
      }
    },

    hasMoved: function(newPosition) {
      // check if the player has moved more than the threshold
      if (this.lastPosition.distanceTo(newPosition) >
        this.data.moveThreshold)
      {
        // console.log('Moved!');
        this.lastPosition = newPosition;
        return true;
      } else {
        return false;
      }
    },

    hasRotated: function(newRotation) {
      // check if the player has rotated more than the threshold
      if (Math.abs(
        THREE.MathUtils.radToDeg(this.lastRotation.angleTo(newRotation))) >
        this.data.rotationThreshold)
      {
        // console.log('Rotated!');
        this.lastRotation = newRotation;
        return true;
      } else {
        return false;
      }
    }
  });
