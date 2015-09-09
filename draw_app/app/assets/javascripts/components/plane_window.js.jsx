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
      </div>
    );
  }
});
