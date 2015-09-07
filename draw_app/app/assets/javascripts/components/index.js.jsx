/* globals React */
'use strict';

var Index = React.createClass({
  componentDidMount: function() {
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var ar = 1 / 3;
    var height = 150;
    var base = height * ar;
    var le = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(height, 2));
    var alpha = Math.atan((base / 2) / height);

    this.setState({
      canvas: canvas,
      ctx: ctx,
      car : {
        base: base,
        height: height,
        le: le,
        alpha: alpha,
        x: 500,
        y: 250,
        vx: 1,
        vy: 1,
        color: 'blue',
        draw: function() {
          var x = this.x;
          var y = this.y;
          var le = this.le;
          var alpha = this.alpha;
          var aoa = Math.atan(this.vy / this.vx);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - le * Math.cos(aoa - alpha), y - le * Math.sin(aoa - alpha));
          ctx.lineTo(x - le * Math.cos(aoa + alpha), y - le * Math.sin(aoa + alpha));
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }, this.draw);
  },
  render: function() {
    return <canvas width='1000' height='500' />;
  },
  draw: function() {
    var canvas = this.state.canvas;
    var ctx = this.state.ctx;
    var car = this.state.car;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    car.draw();
    car.x += car.vx;
    car.y += car.vy;
    if (car.y + car.vy > canvas.height || car.y + car.vy < 0) {
      car.vy = -car.vy;
    }
    if (car.x + car.vx > canvas.width || car.x + car.vx < 0) {
      car.vx = -car.vx;
    }
    window.requestAnimationFrame(this.draw);
  }
});
