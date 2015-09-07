/* globals React */
'use strict';

var Index = React.createClass({
  componentDidMount: function() {
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');

    this.setState({
      canvas: canvas,
      ctx: ctx,
      ball : {
        x: 500,
        y: 250,
        vx: 1,
        vy: 1,
        radius: 25,
        color: 'blue',
        draw: function() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }, function() {
      this.draw();
    }.bind(this));
  },
  render: function() {
    return <canvas width='1000' height='500' />;
  },
  draw: function() {
    var canvas = this.state.canvas;
    var ctx = this.state.ctx;
    var ball = this.state.ball;

    ctx.clearRect(0,0, canvas.width, canvas.height);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
      ball.vy = -Math.random() * 2 * ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
      ball.vx = -Math.random() * 2 * ball.vx;
    }
    window.requestAnimationFrame(this.draw);
  }
});
