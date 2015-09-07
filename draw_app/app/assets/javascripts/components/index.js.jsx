/* globals React */
'use strict';

var Index = React.createClass({
  componentDidMount: function() {
    this.draw();
  },
  render: function() {
    return(
      <canvas id='canvas'>
      </canvas>
    );
  },
  draw: function() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.fillRect(25,25,100,100);
      ctx.clearRect(45,45,60,60);
      ctx.strokeRect(50,50,50,50);
    }
  }
});
