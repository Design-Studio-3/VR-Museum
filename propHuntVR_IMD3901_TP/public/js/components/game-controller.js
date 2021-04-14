AFRAME.registerComponent('game-controller', {
  schema: {
  },

  init: function () {
    // create self variables
    var self = this;
    var el = this.el;

    // set up component variables
    var currentExhibitItemId = -1;
    var completedExhibitIds = [];
    var partsFound = [];
    this.isGameOver = false;

    // add event listeners
    el.addEventListener('update', function (data) {
      // update the game variables
      currentExhibitItemId = data.detail.itemId;
      partsFound = data.detail.partsFound;
      completedExhibitIds = data.detail.completedExhibitIds;
      self.isGameOver = data.detail.gameOver;

      // get the exhibits
      var exhibits = document.querySelectorAll('[exhibit]');

      // loop through each exhibit
      for (var i = 0; i < exhibits.length; i++)
      {
        // get the exhibit id of the current exhibit
        var exhibitId = AFRAME.utils.entity.getComponentProperty(exhibits[i],
          'exhibit.exhibitId');

        // check if this exhibit should be completed
        var shouldBeCompleted = completedExhibitIds.includes(exhibitId);

        // update the exhibit
        exhibits[i].emit('update', {isCompleted: shouldBeCompleted});
      }

      // get the exhibit parts
      var exhibitParts = document.querySelectorAll('[exhibit-part]');

      // loop through each exhibit part
      for (var i = 0; i < exhibitParts.length; i++)
      {
        // get the exhibit-part id of the current exhibit part
        var exhibitPartId = AFRAME.utils.entity.getComponentProperty(
          exhibitParts[i], 'exhibit-part.partId');

        // get the related exhibit id of the current exhibit part
        var relatedExhibitId = AFRAME.utils.entity.getComponentProperty(
          exhibitParts[i], 'exhibit-part.relatedExhibitId');

        var isExhibitCompleted = completedExhibitIds.includes(relatedExhibitId);
        var isAlreadyFound = relatedExhibitId == currentExhibitItemId && partsFound.includes(exhibitPartId);

        // determine if this exhibit part should be visible
        var shouldBeVisible = !(isExhibitCompleted || isAlreadyFound);

        exhibitParts[i].emit('update', {visible: shouldBeVisible});
      }
    });
  },

  tick: function(time, timeDelta) {
    if (this.isGameOver) {
      // const skyColor = new THREE.Color("rgb(0,0,0)");
      const color1 = new THREE.Color("rgb(5, 86, 247)");
      const color2 = new THREE.Color("rgb(215, 5, 247)");
      // skyColor.lerpColors(color1, color2, 0.5);
      color1.lerp(color2, Math.sin(time / 2500));

      var environmentComponent = document.querySelector('[environment]');
      environmentComponent.setAttribute('environment', {
        preset: "default",
        skyType: "color",
        skyColor: "#" + color1.getHexString()
      });
    }
  }
});
