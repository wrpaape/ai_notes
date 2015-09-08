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
    var sRand = function(dim, pad) {
      return pad + Math.random() * (dim - 2 * pad);
    };
    var vAbsRand = function(vAbsMax) {
      return Math.random() * vAbsMax;
    };
    var vRand = function(vAbsMax) {
      return (Math.random() < 0.5 ? -1 : 1) * vAbsRand(vAbsMax);
    };
    var vNegRand = function(v, vAbsMax) {
      return (v < 0 ? 1 : -1) * vAbsRand(vAbsMax);
    };
    var getAOA = function(v) {
      var aoa = Math.atan(v.y / v.x);
      if (v.x < 0 && v.y >= 0) {
        aoa -= Math.PI;
      } else if (v.x < 0 && v.y < 0) {
        aoa += Math.PI;
      }
      return aoa;
    };
    var v = {
      x: vRand(4),
      y: vRand(4)
    };
    this.length = length;
    this.ar = ar;
    this.s = {
      x: sRand(width, length),
      y: sRand(height, length)
    };
    this.v = v;
    this.aoa = getAOA(v);
    this.color = 'pink';
    this.draw = function() {
      var s = this.s;
      var aoa = this.aoa;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - le * Math.cos(aoa - alpha), s.y - le * Math.sin(aoa - alpha));
      ctx.lineTo(s.x - le * Math.cos(aoa + alpha), s.y - le * Math.sin(aoa + alpha));
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    };
    this.update = function() {
      var v = this.v;
      var s = this.s;
      s.x += v.x;
      s.y += v.y;
      if (s.x + v.x > width - length || s.x + v.x < length) {
        v.x = vNegRand(v.x, 4);
      }
      if (s.y + v.y > height - length || s.y + v.y < length) {
        v.y = vNegRand(v.y, 4);
      }
      this.aoa = getAOA(v);
    };
   },
  setCar: function() {
    this.setState({ car: new this.Car(this.state) }, this.setDots.bind(this, 30));
  },
  Dot: function(canvas) {
    var ctx = canvas.ctx;
    var width = canvas.width;
    var height = canvas.height;
    var pad = canvas.pad;
    var sCar = canvas.car.s;
    var radius = pad * 3 / 20 + Math.random() * pad / 10;
    var thisPad = radius + pad;
    var s = {
      x: thisPad + Math.random() * (width - 2 * thisPad),
      y: thisPad + Math.random() * (height - 2 * thisPad)
    };
    this.radius = radius;
    this.s = s;
    this.color = 'blue';
    this.getDistance = function() {
      return Math.sqrt(Math.pow(s.x - sCar.x, 2) + Math.pow(s.y - sCar.y, 2)) - radius;
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, 2 * Math.PI, true);
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
      all: dots,
      drawAll: function() {
        this.all.forEach(function(dot) {
          dot.draw();
        });
      },
      updateAll: function() {
        var dots = this.all.sort(function(a, b) {
          [a, b].forEach(function(dot) {
            dot.color = 'blue';
            dot.distance = dot.getDistance();
          });

          return b.distance - a.distance;
        });

        var i = dots.length - 1;
        while (dots[i].distance < 0) {
          dots[i--] = new Dot();
        }
        dots[i].color = 'green';
      }
    };
    dots.updateAll();
    dots.closest = dots.all[0];

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
