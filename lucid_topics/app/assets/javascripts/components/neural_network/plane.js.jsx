/* globals React */
'use strict';

var Plane = React.createClass({
  componentDidUpdate: function() {
    var planes = this.props.planes;
    var plane = planes[this.props.indexSelected];
    var alpha = plane.alpha;
    var theta = plane.theta;
    var color = plane.color;
    var canvas = document.getElementById('plane');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var xo = width / 2;
    var yo = height / 2;
    var rBall = width / 25;
    var rArrow = xo - 4 * rBall;
    var xBall = xo + (rArrow + 2 * rBall) * Math.cos(theta);
    var yBall = yo + (rArrow + 2 * rBall) * Math.sin(theta);
    var drawDottedLine = this.drawDottedLine;
    var drawArrow = this.drawArrow;
    var drawBall = this.drawBall;
    var draw = function() {
      ctx.clearRect(0, 0, width, height);
      plane.draw(ctx);
      drawDottedLine(ctx, xo, yo, 2 * xo, yo);
      drawArrow(ctx, xo, yo, rArrow, alpha, color, rArrow / 6);
      drawArrow(ctx, xo, yo, rArrow, theta, 'blue', rArrow / 3);
      drawBall(ctx, xBall, yBall, rBall);
    };

    window.requestAnimationFrame(draw);
  },
  drawDottedLine: function(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.setLineDash([10]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  },
  drawArrow: function(ctx, xo, yo, r, phi, color, rArc) {
    var le = r / 10;
    var lambda = Math.PI / 6;
    var rx = r * Math.cos(phi) + xo;
    var ry = r * Math.sin(phi) + yo;
    var delta1 = phi - lambda;
    var delta2 = Math.PI / 2 - phi - lambda;
    var lex1 = rx - le * Math.cos(delta1);
    var ley1 = ry - le * Math.sin(delta1);
    var lex2 = rx - le * Math.sin(delta2);
    var ley2 = ry - le * Math.cos(delta2);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xo, yo);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    ctx.lineTo(lex1, ley1);
    ctx.stroke();
    ctx.moveTo(rx, ry);
    ctx.lineTo(lex2, ley2);
    ctx.stroke();
    ctx.moveTo(xo + rArc, yo);
    ctx.arc(xo, yo, rArc, 0, phi, false);
    ctx.stroke();
    ctx.restore();
  },
  drawBall: function(ctx, x, y, r) {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  render: function() {
    return(
      <div>
        <canvas id='plane' width='200' height='200' />
        <PlaneWindow planes={ this.props.planes } indexSelected={ this.props.indexSelected } updateIndex={ this.props.updateIndex } drawDottedLine={ this.drawDottedLine } drawArrow={ this.drawArrow } />
      </div>
    );
  }
});
