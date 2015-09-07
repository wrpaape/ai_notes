/* globals React */
'use strict';

var Index = React.createClass({
  getInitialState: function() {
    return this.getDims();
  },
  componentDidMount: function() {
    window.addEventListener('resize', this.refreshDims);
    this.draw();
  },
  render: function() {
    // var style = {
    //   width: this.state.width + 'px',
    //   height: this.state.height + 'px'
    // };
    var style = {
      width: '200px',
      height: '200px'
    }

    return <canvas style={ style } />;
  },
  getDims: function() {
    var width = window.innerWidth / 2;

    return({
      width: width,
      height: width / 2
    });
  },
  refreshDims: function() {
    this.setState(this.getDims());
  },
  draw: function() {
    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    ctx.strokeRect(0, 0, 200, 200);
  }
});
