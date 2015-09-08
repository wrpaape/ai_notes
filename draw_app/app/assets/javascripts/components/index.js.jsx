/* globals React */
'use strict';

var Index = React.createClass({
  componentDidMount: function() {
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var pad = height / 10;
    var sRand = function(dir, pad) {
      var dim = dir === 'x' ? width : height;
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
    var initializeVectors = function() {
      var pad = this.pad;
      var vAbsMax = this.vAbsMax;
      this.s = {
        x: sRand('x', pad),
        y: sRand('y', pad)
      };
      this.v = {
        x: vRand(vAbsMax),
        y: vRand(vAbsMax)
      };
    };
    var updateVectors = function() {
      var s = this.s;
      var v = this.v;
      var vAbsMax = this.vAbsMax;
      var pad = this.pad;
      s.x += v.x;
      s.y += v.y;
      if (s.x + v.x > width - pad || s.x + v.x < pad) {
        v.x = vNegRand(v.x, vAbsMax);
      }
      if (s.y + v.y > height - pad || s.y + v.y < pad) {
        v.y = vNegRand(v.y, vAbsMax);
      }
    };

    this.setState(
      {
        Plane: function() {
          var c = pad;
          var ar = 1 / 3;
          var b = c * ar;
          var le = Math.sqrt(Math.pow(b / 2, 2) + Math.pow(c, 2));
          var alpha = Math.atan(b / 2 / c);
          this.initializeVectors = initializeVectors;
          this.updateVectors = updateVectors;
          this.updateAOA = function() {
            var v = this.v;
            this.aoa = Math.atan(v.y / v.x);
            if (v.x < 0 && v.y >= 0) {
              this.aoa -= Math.PI;
            } else if (v.x < 0 && v.y < 0) {
              this.aoa += Math.PI;
            }
          };
          this.draw = function() {
            var s = this.s;
            var aoa = this.aoa;
            ctx.moveTo(s.x, s.y);
            for(var i = -1; i <= 1; i+= 2) {
              ctx.lineTo(s.x - le * Math.cos(aoa + i * alpha), s.y - le * Math.sin(aoa + i * alpha));
            }
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
          };
          this.update = function() {
            this.updateVectors();
            this.updateAOA();
          };

          this.c = c;
          this.ar = ar;
          this.pad = c;
          this.vAbsMax = 4;
          this.color = 'pink';
          this.initializeVectors();
          this.updateAOA();
        },
        Dot: function(sPlane) {
          var radius = pad * 3 / 20 + Math.random() * pad / 10;
          this.initializeVectors = initializeVectors;
          this.updateVectors = updateVectors;
          this.updateDistance = function() {
            var s = this.s;
            this.distance = Math.sqrt(Math.pow(s.x - sPlane.x, 2) + Math.pow(s.y - sPlane.y, 2)) - radius;
          };
          this.draw = function() {
            var s = this.s;
            ctx.beginPath();
            ctx.arc(s.x, s.y, radius, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
          };
          this.update = function() {
            this.color = 'blue';
            this.updateVectors();
            this.updateDistance();
          };

          this.radius = radius;
          this.pad = radius + pad;
          this.vAbsMax = 0.1;
          this.color = 'blue';
          this.initializeVectors();
          this.updateDistance();
        },
        drawBG: function() {
          ctx.clearRect(0, 0, width, height);
          ctx.strokeRect(pad, pad, width - 2 * pad, height - 2 * pad);
        }
      },
      this.setPlane
    );
  },
  setPlane: function() {
    var Plane = this.state.Plane;
    this.setState({ plane: new Plane() }, this.setDots.bind(this, 30));
  },
  setDots: function(numDots) {
    var Dot = this.state.Dot.bind(this, this.state.plane.s);
    var dots = [];
    while (dots.length < numDots) {
      dots.push(new Dot());
    }
    dots = {
      all: dots,
      drawAndUpdate: function() {
        this.all.forEach(function(dot) {
          dot.draw();
          dot.update();
        });
      },
      setTargets: function() {
        var all = this.all.sort(function(a, b) {
          return b.distance - a.distance;
        });

        var i = all.length - 1;
        while (all[i].distance < 0) {
          all[i--] = new Dot();
        }
        all[i].color = 'green';
        this.target = all[i];
      }
    };
    dots.drawAndUpdate();
    dots.setTargets();

    this.setState({ dots: dots }, this.draw);
  },
  draw: function() {
    var plane = this.state.plane;
    var dots = this.state.dots;
    console.log(dots.target);
    this.state.drawBG();
    plane.draw();
    dots.drawAndUpdate();
    plane.update();
    dots.setTargets();
    window.requestAnimationFrame(this.draw);
  },
  render: function() {
    return <canvas width='1000' height='500' />;
  }
});
