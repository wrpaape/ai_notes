'use strict';

var neuron = function(inputs) {
  this.getInitalWeights = function() {
    var numInputs = inputs.length;
    this.weights = [];
    for (var i = 0; i < numInputs; i++) {
      this.weights.push(2 * Math.random() - 1);
    }
  };
  this.updateActivation = function() {
    var i = 0;
    this.activation = 0;
    while (i++ < inputs.length) {
      this.activation += this.inputs[i] * this.weights[i];
    }
  };
  this.updateOutput = function() {
    var p = 1.0;
    this.output = Math.pow(1 + Math.pow(Math.E, -a / p), -1);
  };
  this.hello = 'World';
  this.inputs = inputs;
  this.weights = getInitalWeights();
  this.updateActivation();
  this.updateOutput();
};

var neuralNetwork = function(inputs) {
  var numInputs = inputs.length;
  var numHiddens = 6;
  var numOutputs = Object.keys(inputs[0]).length;
  this.inputLayer = [];
  this.hiddenLayer = [];
  this.outputLayer = [];
  for (var i = 0; i < numInputs; i++) {
    this.inputLayer.push(new neuron(inputs[i]));
  }
  for (var j = 0; j < numHiddens; j++) {
    this.hiddenLayer.push(new neuron());
  }
  for (var k = 0; k < numOutputs; k++) {
    this.outputLayer.push(new neuron());
  }
};
