AFRAME.registerComponent('exhibit-part', {
  schema: {
    relatedExhibitId: {default: -1},
    partId: {default: -1}
  },

  init: function () {
    const self = this;
    const el = this.el;

    // Create geometry
    el.setAttribute('geometry', {
      primitive: "box"
    });
    el.setAttribute('material', {
      color: "black"
    });
    el.setAttribute("class", "interactive");

    // add click event listener
    el.addEventListener('click', function (evt) {
      // check if the exhibit part is visible
      if (el.getAttribute('visible'))
      {
        // do logging
        console.log(`Exhibit part ${self.data.partId} was found!`);

        // emit the part found event to the server
        socket.emit('partFound', {
          itemId: self.data.relatedExhibitId, partNumber: self.data.partId});
      }
    });

    // add update event listener
    el.addEventListener('update', function (data) {
      // set the visibility of this exhibit part
      el.setAttribute('visible', data.detail.visible);
    });
  }
});
