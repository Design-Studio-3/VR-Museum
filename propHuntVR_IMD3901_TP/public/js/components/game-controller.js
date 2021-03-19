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
      completedExhibitIds = data.detail.completedExhibitIds;

      // get the exhibits
      var exhibits = document.querySelectorAll('[exhibit]');

      // loop through each  exhibit
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
    });
  }
});
