/* globals React */
'use strict';

var NeuralNetwork = React.createClass({
  getInitialState: function() {
    return({
      indexSelected: 0,
      planeComp: <div/>
    });
  },
  componentDidMount: function() {
    var canvas = document.getElementById('neural-network');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var pad = height / 10;
    var getMagnitude = this.getMagnitude;
    var randRange = function(min, max) {
      return min + (max - min) * Math.random();
    };
    var sRand = function(dir, pad) {
      var dim = dir === 'x' ? width : height;
      return randRange(pad, dim - pad);
    };
    var vNegRand = function(v, vMagMin, vMagMax) {
      return (v < 0 ? 1 : -1) * randRange(vMagMin, vMagMax);
    };
    var initializeVectors = function() {
      var pad = this.pad;
      var vMag = randRange(this.vMagMin, this.vMagMax);
      var alpha = randRange(0, 2 * Math.PI);
      this.s = {
        x: sRand('x', pad),
        y: sRand('y', pad)
      };
      this.v = {
        x: vMag * Math.cos(alpha),
        y: vMag * Math.sin(alpha)
      };
      this.a = {
        x: 0,
        y: 0
      };
    };
    var updateDotVectors = function() {
      var s = this.s;
      var v = this.v;
      var vMagMin = this.vMagMin;
      var vMagMax = this.vMagMax;
      var pad = this.pad;
      s.x += v.x;
      s.y += v.y;
      if (s.x + v.x > width - pad || s.x + v.x < pad) {
        v.x = vNegRand(v.x, vMagMin, vMagMax);
      }
      if (s.y + v.y > height - pad || s.y + v.y < pad) {
        v.y = vNegRand(v.y, vMagMin, vMagMax);
      }
    };

    var updatePlaneVectors = function() {
      var s = this.s;
      var v = this.v;
      var a = this.a;
      var alpha = this.alpha;
      var pad = this.pad;
      s.x += v.x;
      s.y += v.y;
      v.x += a.x;
      v.y += a.y;

      if (s.x + v.x > width - pad || s.x + v.x < pad) {
        v.x = 0;
      }

      if (s.y + v.y > height - pad || s.y + v.y < pad) {
        v.y = 0;
      }
    };

    this.setState(
      {
        Plane: function() {
          var ar = 1 / 3;
          var c = pad;
          var b = ar * c;
          var le = getMagnitude(b / 2, c);
          var lambda = Math.atan(b / 2 / c);
          this.updateAngle = function(vec, phi) {
            vec = this[vec];
            this[phi] = Math.atan(vec.y / vec.x);
            if (vec.x < 0 && vec.y >= 0) {
              this[phi] -= Math.PI;
            } else if (vec.x < 0 && vec.y < 0) {
              this[phi] += Math.PI;
            }
            if (this[phi] < 0) {
              this[phi] += 2 * Math.PI;
            }
          };
          this.initializeVectors = initializeVectors;
          this.updateVectors = updatePlaneVectors;
          this.draw = function(childCtx) {
            var context = childCtx || ctx;
            var s = this.s;
            var alpha = this.alpha;
            context.beginPath();
            context.moveTo(s.x, s.y);
            for(var i = -1; i <= 1; i+= 2) {
              context.lineTo(s.x - le * Math.cos(alpha + i * lambda), s.y - le * Math.sin(alpha + i * lambda));
            }
            context.lineTo(s.x - le * Math.cos(alpha - lambda), s.y - le * Math.sin(alpha - lambda));
            context.lineTo(s.x - le * Math.cos(alpha + lambda), s.y - le * Math.sin(alpha + lambda));
            context.closePath();
            context.fillStyle = this.color;
            context.fill();
          };
          this.update = function() {
            this.updateVectors();
            this.updateAngle('v', 'alpha');
          };
          this.updateDeltaS = function() {
            var s = this.s;
            var sTarget = this.target.s;
            this.deltaS = {
              x: sTarget.x - s.x,
              y: sTarget.y - s.y
            };
          };
          this.updateRho = function() {
            var deltaS = this.deltaS;
            this.rho = getMagnitude(deltaS.x, deltaS.y);
          };

          this.c = c;
          this.ar = ar;
          this.pad = c;
          this.vMagMin = 0;
          this.vMagMax = 20;
          this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          this.initializeVectors();
          this.updateAngle('v', 'alpha');
        },
        Dot: function(allPlanes) {
          var radius = pad * 3 / 20 + Math.random() * pad / 10;
          this.initializeVectors = initializeVectors;
          this.updateVectors = updateDotVectors;
          this.updateRhos = function() {
            var s = this.s;
            this.rhos = allPlanes.map(function(plane) {
              return getMagnitude(s.x - plane.s.x, s.y - plane.s.y) - radius;
            });
          };
          this.draw = function(colorSelected) {
            var s = this.s;
            var colors = this.colors;
            var arcStart = 0;
            var arcInc = 2 * Math.PI / colors.length;
            if (~colors.indexOf(colorSelected)) {
              ctx.strokeStyle = 'yellow';
              ctx.lineWidth = 8;
              ctx.setLineDash([5]);
            } else {
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 1;
            }
            colors.forEach(function(color) {
              ctx.beginPath();
              ctx.arc(s.x, s.y, radius, arcStart, arcStart + arcInc, false);
              ctx.stroke();
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
            this.updateRhos();
          };

          this.radius = radius;
          this.pad = radius + pad;
          this.vMagMin = 0.1;
          this.vMagMax = 1;
          this.colors = ['blue'];
          this.initializeVectors();
          this.updateRhos();
        },
        clear: function() {
          ctx.clearRect(0, 0, width, height);
        }
      },
      this.setPlanes.bind(this, 2)
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
      DrawAndUpdate: function(colorSelected) {
        var allDots = this.all;
        allDots.forEach(function(dot) {
          dot.draw(colorSelected);
          dot.update();
        });
        allPlanes.forEach(function(plane, i) {
          allDots.sort(function(a, b) {
            return b.rhos[i] - a.rhos[i];
          });
          var j = allDots.length - 1;
          while (allDots[j].rhos[i] < 0) {
            allDots[j--] = new Dot();
          }
          var target = allDots[j];
          if (target.colors[0] === 'blue') {
            target.colors[0] = plane.color;
          } else {
            target.colors.push(plane.color);
          }
          plane.target = target;
          plane.updateDeltaS();
          plane.updateRho();
          plane.updateAngle('deltaS', 'theta');
          plane.a.x = Math.cos(plane.theta) / 5;
          plane.a.y = Math.sin(plane.theta) / 5;
        });
      }
    };

    this.setState({ dots: dots }, this.draw);
  },
  draw: function() {
    var planes = this.state.planes;
    var indexSelected = this.state.indexSelected;
    this.state.clear();
    planes.DrawAndUpdate();
    this.state.dots.DrawAndUpdate(planes.all[indexSelected].color);
    this.setState({ planeComp: <Plane planes={ planes.all.map(this.extendPlane) } indexSelected={ indexSelected } updateIndex={ this.updateIndex } /> });

    window.requestAnimationFrame(this.draw);
  },
  extendPlane: function(plane) {
    return({
      s: {
        x: 100,
        y: 100
      },
      vMag: this.getMagnitude(plane.v.x, plane.v.y) * 60,
      alpha: plane.alpha,
      rho: plane.rho,
      theta: plane.theta,
      color: plane.color,
      draw: plane.draw
    });
  },
  getMagnitude: function(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  },
  updateIndex: function(newIndex) {
    this.setState({
      indexSelected: newIndex
    });
  },
  render: function() {
    return(
      <div>
        <canvas id='neural-network' width='1000' height='500' />
        <div>
          { this.state.planeComp }
        </div>
      </div>
    );
  }
});
