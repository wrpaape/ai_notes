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
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            for(var i = -1; i <= 1; i+= 2) {
              ctx.lineTo(s.x - le * Math.cos(aoa + i * alpha), s.y - le * Math.sin(aoa + i * alpha));
            }
            ctx.lineTo(s.x - le * Math.cos(aoa - alpha), s.y - le * Math.sin(aoa - alpha));
            ctx.lineTo(s.x - le * Math.cos(aoa + alpha), s.y - le * Math.sin(aoa + alpha));
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
          this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          this.initializeVectors();
          this.updateAOA();
        },
        Dot: function(allPlanes) {
          var radius = pad * 3 / 20 + Math.random() * pad / 10;
          this.initializeVectors = initializeVectors;
          this.updateVectors = updateVectors;
          this.updateDistances = function() {
            var s = this.s;
            this.distances = allPlanes.map(function(plane) {
              return Math.sqrt(Math.pow(s.x - plane.s.x, 2) + Math.pow(s.y - plane.s.y, 2)) - radius;
            });
          };
          this.draw = function() {
            var s = this.s;
            var arcStart = 0;
            var arcInc = 2 * Math.PI / this.colors.length;
            this.colors.forEach(function(color) {
              ctx.beginPath();
              ctx.arc(s.x, s.y, radius, arcStart, arcStart + arcInc, false);
              ctx.lineTo(s.x, s.y);
              ctx.closePath();
              ctx.fillStyle = color;
              ctx.fill();
              arcStart += arcInc;
            });
          };
          this.update = function() {
            this.colors = ['blue'];
            this.updateVectors();
            this.updateDistances();
          };

          this.radius = radius;
          this.pad = radius + pad;
          this.vAbsMax = 0.1;
          this.colors = ['blue'];
          this.initializeVectors();
          this.updateDistances();
        },
        drawBG: function() {
          ctx.clearRect(0, 0, width, height);
          ctx.strokeRect(pad, pad, width - 2 * pad, height - 2 * pad);
        }
      },
      this.setPlanes.bind(this, 3)
    );
  },
  setPlanes: function(numPlanes) {
    var Plane = this.state.Plane;
    var allPlanes = [];
    while (allPlanes.length < numPlanes) {
      allPlanes.push(new Plane());
    }
    var planes = {
      all: allPlanes,
      DrawAndUpdate: function() {
        this.all.forEach(function(plane) {
          plane.draw();
          plane.update();
        });
      }
    };

    this.setState({ planes: planes }, this.setDots.bind(this, 10));
  },
  setDots: function(numDots) {
    var allPlanes = this.state.planes.all;
    var Dot = this.state.Dot.bind(this, allPlanes);
    var allDots = [];
    while (allDots.length < numDots) {
      allDots.push(new Dot());
    }
    var dots = {
      all: allDots,
      DrawAndUpdate: function() {
        var allDots = this.all;
        allDots.forEach(function(dot) {
          dot.draw();
          dot.update();
        });
        allPlanes.forEach(function(plane, i) {
          allDots.sort(function(a, b) {
            return b.distances[i] - a.distances[i];
          });
          var j = allDots.length - 1;
          while (allDots[j].distances[i] < 0) {
            allDots[j--] = new Dot();
          }
          var target = allDots[j];
          if (target.colors[0] === 'blue') {
            target.colors[0] = plane.color;
          } else {
            target.colors.push(plane.color);
          }
          plane.target = target;
        });
      }
    };

    this.setState({ dots: dots }, this.draw);
  },
  draw: function() {
    this.state.drawBG();
    this.state.planes.DrawAndUpdate();
    this.state.dots.DrawAndUpdate();
    window.requestAnimationFrame(this.draw);
  },
  render: function() {
    return <canvas width='1000' height='500' />;
  }
});
