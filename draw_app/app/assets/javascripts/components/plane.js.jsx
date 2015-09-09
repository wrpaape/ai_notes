/* globals React */
'use strict';

var Plane = React.createClass({
  componentDidUpdate: function() {
    var canvas = document.getElementById('plane');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var ox = width / 2;
    var oy = height / 2;
    var rMax = (ox > oy ? oy : ox) - 10;
    var planes = this.props.planes;
    var plane = planes[this.props.indexSelected];
    var draw = function() {
      ctx.clearRect(0, 0, width, height);
      plane.draw(ctx);
      this.drawAxis(ctx, ox, oy);
      this.drawArrow(ctx, ox, oy, rMax, plane.alpha, plane.color, rMax / 6);
      this.drawArrow(ctx, ox, oy, rMax, plane.theta, 'blue', rMax / 3);
    }.bind(this);

    window.requestAnimationFrame(draw);
  },
  drawAxis: function(ctx, ox, oy) {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.setLineDash([10]);
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(2 * ox, oy);
    ctx.stroke();
    ctx.restore();
  },
  drawArrow: function(ctx, ox, oy, r, theta, color, rArc) {
    var le = r / 10;
    var lambda = Math.PI / 8;
    var rx = r * Math.cos(theta) + ox;
    var ry = r * Math.sin(theta) + oy;
    var delta1 = theta - lambda;
    var delta2 = Math.PI / 2 - theta - lambda;
    var lex1 = rx - le * Math.cos(delta1);
    var ley1 = ry - le * Math.sin(delta1);
    var lex2 = rx - le * Math.sin(delta2);
    var ley2 = ry - le * Math.cos(delta2);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    ctx.lineTo(lex1, ley1);
    ctx.stroke();
    ctx.moveTo(rx, ry);
    ctx.lineTo(lex2, ley2);
    ctx.stroke();
    if (rArc) {
      ctx.moveTo(ox + rArc, oy);
      ctx.arc(ox, oy, rArc, 0, theta, false);
      ctx.stroke();
    }
    ctx.restore();
  },
  render: function() {
    return(
      <div>
        <canvas id='plane' width='200' height='200' />
        <PlaneWindow planes={ this.props.planes } indexSelected={ this.props.indexSelected } updateIndex={ this.props.updateIndex } />
      </div>
    );
  }
});
