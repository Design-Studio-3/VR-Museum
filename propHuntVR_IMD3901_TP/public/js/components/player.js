import * as utils from '../utils/utils.js';

AFRAME.registerComponent('player', {
    schema: {
      moveThreshold: {type:'number', default: 0.1},
      rotationThreshold: {type: 'number', default: 0.1}
    },
    init: function() {
      // set up initial vars
      this.lastPosition = utils.getPosition(this.el);
      this.lastRotation = utils.getRotation(this.el);

      // emit a moved event once created
      socket.emit('moved', {
        newPosition:
        {x: this.lastPosition.x, y: this.lastPosition.y, z: this.lastPosition.z},
        newRotation:
        {x: this.lastRotation.x, y: this.lastRotation.y, z: this.lastRotation.z,
          w: this.lastRotation.w}});
    },

    tick: function() {
      var newPosition = utils.getPosition(this.el);
      var newRotation = utils.getRotation(this.el);

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

  AFRAME.registerComponent('hitbox',
  {
    init: function() {
      this.el.addEventListener('collide', function(e) {
        console.log('Player has collided with ', e.detail.body.el);
        e.detail.target.el; // Original entity (playerEl).
        e.detail.body.el; // Other entity, which playerEl touched.
        e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
        e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
      });
    }
  })
