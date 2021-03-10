// the OtherPlayer component (created to visualize other connected players)
AFRAME.registerComponent('other-player', {
    schema: {
      name: {type: 'string', default: ''},
      color: {type: 'color', default: 'grey'}
    },
    init: function () {
      this.el.setAttribute('geometry', {
        primitive: 'box',
        height: 1.6,
        depth: 0.5
      });
      this.el.setAttribute('material', {
        color: this.data.color
      });
    }
  });