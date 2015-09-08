/* globals React */
'use strict';

var Index = React.createClass({
  componentDidMount: function() {
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var pad = height / 10;
    var carHeight = pad;
    var ar = 1 / 3;
    var base = carHeight * ar;
    var le = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(carHeight, 2));
    var alpha = Math.atan((base / 2) / carHeight);
    var x0 = width / 2;
    var y0 = height / 2;
    var vx0 = 3;
    var vy0 = 3;
    var numDots = 10;

    this.setState(
      {
        ctx: ctx,
        width: width,
        height: height,
        pad: pad,
        numDots: numDots,
        car : {
          base: base,
          height: carHeight,
          le: le,
          alpha: alpha,
          x: x0,
          y: y0,
          vx: vx0,
          vy: vy0,
          color: 'pink',
          draw: function() {
            var x = this.x;
            var y = this.y;
            var vx = this.vx;
            var vy = this.vy;
            var le = this.le;
            var alpha = this.alpha;
            var aoa = Math.atan(vy / vx);
            if (vx < 0 && vy >= 0) {
              aoa -= Math.PI;
            } else if (vx < 0 && vy < 0) {
              aoa += Math.PI;
            }

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - le * Math.cos(aoa - alpha), y - le * Math.sin(aoa - alpha));
            ctx.lineTo(x - le * Math.cos(aoa + alpha), y - le * Math.sin(aoa + alpha));
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
          },
          update: function() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y + this.vy > height - this.height || this.y + this.vy < this.height) {
              this.vy = -Math.random() * 2 * this.vy;
            }
            if (this.x + this.vx > width - this.height || this.x + this.vx < this.height) {
              this.vx = -Math.random() * 2 * this.vx;
            }
          }
        }
      },
      this.setDots
    );
  },
  Dot: function(state) {
    var ctx = state.ctx;
    var width = state.width;
    var height = state.height;
    var pad = state.pad;
    var car = state.car;
    var radius = pad * 3 / 20 + Math.random() * pad / 10;
    var thisPad = radius + pad;
    var x = thisPad + Math.random() * (width - 2 * thisPad);
    var y = thisPad + Math.random() * (height - 2 * thisPad);
    var color = 'blue';
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.getDistance = function() {
      return Math.sqrt(Math.pow(x - car.x, 2) + Math.pow(y - car.y, 2)) - radius;
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
  },
  setDots: function() {
    var Dot = this.Dot.bind(this, this.state);
    var numDots = this.state.numDots;
    var dots = [];
    while (dots.length < numDots) {
      dots.push(new Dot());
    }

    dots = {
      dots: dots,
      drawAll: function() {
        this.dots.forEach(function(dot) {
          dot.draw();
        });
      },
      updateAll: function() {
        var dots = this.dots.sort(function(a, b) {
          [a, b].forEach(function(dot) {
            dot.color = 'blue';
            dot.distance = dot.getDistance();
          });

          return a.distance - b.distance;
        });

        var i = 0;
        while (dots[i].distance < 0) {
          dots[i++] = new Dot();
        }
        dots[i].color = 'green';
      }
    };
    dots.updateAll();

    this.setState({ dots: dots }, this.draw);
  },
  draw: function() {
    var ctx = this.state.ctx;
    var width = this.state.width;
    var height = this.state.height;
    var pad = this.state.pad;
    var car = this.state.car;
    var dots = this.state.dots;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeRect(pad, pad, width - 2 * pad, height - 2 * pad);
    car.draw();
    dots.drawAll();
    car.update();
    dots.updateAll();
    window.requestAnimationFrame(this.draw);
  },
  render: function() {
    return <canvas width='1000' height='500' />;
  }
});
