AFRAME.registerComponent('game-controller', {
  schema: {
  },

  init: function () {
    // create self variables
    var self = this;
    var el = this.el;

    // set up component variables
    var currentExhibitItemId = -1;
    var partsFound = [];

    // add event listeners
    el.addEventListener('update', function (data) {
      // update the game variables
      currentExhibitItemId = data.detail.itemId;
      partsFound = data.detail.partsFound;
    });
  }
});
