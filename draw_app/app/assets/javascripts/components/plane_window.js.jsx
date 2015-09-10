/* globals React */
'use strict';

var PlaneWindow = React.createClass({
  getInitialState: function() {
    return({
      indexSelected: this.props.indexSelected
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      indexSelected: nextProps.indexSelected
    });
  },
  componentDidUpdate: function() {
    var planes = this.props.planes;
    var drawDottedLine = this.props.drawDottedLine;
    var drawArrow = this.props.drawArrow;
    var plane = planes[this.state.indexSelected];
    var canvas = document.getElementById('plane-window');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var xo1 = height / 10;
    var yo = height / 4;
    var deltaX = (width - 3 * xo1) / 2;
    var phi = Math.PI / 12;
    var r = deltaX / Math.cos(phi);
    var xo2 = width - deltaX - xo1;
    var heightText = 3 * xo1 / 2;
    var formatScalar = function(scalar, v) {
      return Math.round(scalar) + (v ? ' m/s' : ' m');
    };
    var formatPhi = function(phi) {
      return Math.round(phi * 180 / Math.PI) + ' °';
    };


    var draw = function() {
      ctx.clearRect(0, 0, width, height);
      drawDottedLine(ctx, xo1, yo, xo1 + deltaX, yo);
      drawArrow(ctx, xo1, yo, r, phi, plane.color, 2 * r / 5);
      ctx.font = '25px serif';
      ctx.fillStyle = plane.color;
      ctx.fillText('plane', xo1, heightText);
      ctx.fillText('v: ' + formatScalar(plane.vMag, true), xo1, height - 2 * heightText - 4);
      ctx.fillText('α: ' + formatPhi(plane.alpha), xo1, height - heightText);
      drawDottedLine(ctx, xo2, yo, xo2 + deltaX, yo);
      drawArrow(ctx, xo2, yo, r, phi, 'blue', 2 * r / 5);
      ctx.fillStyle = 'blue';
      ctx.fillText('target', xo2, heightText);
      ctx.fillText('ρ: ' + formatScalar(plane.rho), xo2, height - 2 * heightText - 4);
      ctx.fillText('θ: ' + formatPhi(plane.theta), xo2, height - heightText);
    }.bind(this);

    window.requestAnimationFrame(draw);
  },
  selectPlane: function(event) {
    this.props.updateIndex(event.target.value);
  },
  render: function() {
    var planes = this.props.planes;
    var indexSelected = this.state.indexSelected;
    var plane = planes[indexSelected];

    var options = planes.map(function(plane, i) {

      return <option key={ i } value={ i } >{ window.classifier.classify(plane.color) }</option>;
    });

    return(
      <div>
        <select value={ this.state.indexSelected } onChange={ this.selectPlane }>
          { options }
        </select>
        <div>
          <canvas id='plane-window' width='300' height='150' />
        </div>
      </div>
    );
  }
});
