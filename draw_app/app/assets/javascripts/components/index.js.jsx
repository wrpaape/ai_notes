/* globals React */
'use strict';

var Index = React.createClass({
  componentDidMount: function() {
    var canvas = document.getElementsByTagName('canvas')[0];
    this.setState(
      {
        ctx: canvas.getContext('2d'),
        width: canvas.width,
        height: canvas.height,
        pad: canvas.height / 10
      },
      this.setCar
    );
  },
  Car: function(canvas) {
    var ctx = canvas.ctx;
    var width = canvas.width;
    var height = canvas.height;
    var length = canvas.pad;
    var ar = 1 / 3;
    var span = length * ar;
    var le = Math.sqrt(Math.pow(span / 2, 2) + Math.pow(length, 2));
    var alpha = Math.atan((span / 2) / length);
    var randCoord = function(dim) {
      return length + Math.random() * (dim - 2 * length);
    };
    var randV = function(max) {
      return (Math.random() < 0.5 ? -1 : 1) * Math.random() * max;
    };
    var getAOA = function(vx, vy) {
      var aoa = Math.atan(vy / vx);
      if (vx < 0 && vy >= 0) {
        aoa -= Math.PI;
      } else if (vx < 0 && vy < 0) {
        aoa += Math.PI;
      }
      return aoa;
    };
    var vx = randV(4);
    var vy = randV(4);
    this.length = length;
    this.ar = ar;
    this.x = randCoord(width);
    this.y = randCoord(height);
    this.vx = vx;
    this.vy = vy;
    this.aoa = getAOA(vx, vy);
    this.color = 'pink';
    this.draw = function() {
      var x = this.x;
      var y = this.y;
      var aoa = this.aoa;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - le * Math.cos(aoa - alpha), y - le * Math.sin(aoa - alpha));
      ctx.lineTo(x - le * Math.cos(aoa + alpha), y - le * Math.sin(aoa + alpha));
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    };
    this.update = function() {
      var vx = this.vx;
      var vy = this.vy;
      this.x += vx;
      this.y += vy;
      var x = this.x;
      var y = this.y;
      if (x + vx > width - length || x + vx < length) {
        vx *= -Math.random() * 2;
        this.vx = vx;
      }
      if (y + vy > height - length || y + vy < length) {
        vy *= -Math.random() * 2;
        this.vy = vy;
      }
      this.aoa = getAOA(vx, vy);
    };
   },
  setCar: function() {
    this.setState({ car: new this.Car(this.state) }, this.setDots.bind(this, 10));
  },
  Dot: function(canvas) {
    var ctx = canvas.ctx;
    var width = canvas.width;
    var height = canvas.height;
    var pad = canvas.pad;
    var car = canvas.car;
    var radius = pad * 3 / 20 + Math.random() * pad / 10;
    var thisPad = radius + pad;
    this.x = thisPad + Math.random() * (width - 2 * thisPad);
    this.y = thisPad + Math.random() * (height - 2 * thisPad);
    this.radius = radius;
    this.color = 'blue';
    this.getDistance = function() {
      return Math.sqrt(Math.pow(this.x - car.x, 2) + Math.pow(this.y - car.y, 2)) - radius;
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      this.jitter();
    };
    this.jitter = function() {

    };
  },
  setDots: function(numDots) {
    var Dot = this.Dot.bind(this, this.state);
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
