/* globals React */
'use strict';

var Plane = React.createClass({
  componentDidUpdate: function() {
    var canvas = document.getElementById('plane');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var plane = this.props.plane;
    var draw = function() {
      ctx.clearRect(0, 0, width, height);
      plane.draw(ctx);
    };

    window.requestAnimationFrame(draw);
  },
  render: function() {
    return <canvas id='plane' width='250' height='250' />;
  }
});
