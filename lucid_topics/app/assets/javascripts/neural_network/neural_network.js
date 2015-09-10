'use strict';

var Neuron = function(numInputs) {
  var rateCrossOver = 0.7;
  var rateMutation = 0.1;
  this.getInitalWeights = function() {
    this.bias = 1;
    this.weights = [];
    for (var i = 0; i < numInputs; i++) {
      this.weights.push(2 * Math.random() - 1);
    }
  };
  this.updateActivation = function() {
    var a = 0;
    for (var i = 0; i < numInputs; i++) {
      a += this.inputs[i] * this.weights[i];
    }
    this.activation = a - this.bias;
  };
  this.updateOutput = function() {
    var p = 1.0;
    this.output = Math.pow(1 + Math.pow(Math.E, -this.activation / p), -1);
  };
  this.processInputs = function(inputs) {
    this.inputs = inputs;
    this.updateActivation();
    this.updateOutput();
  };

  this.getInitalWeights();
};

var NeuralNetwork = function(numInputs, dimInput) {
  this.layers = [
    {
      type: 'input',
      numNeurons: numInputs,
      neurons: []
    },
    {
      type: 'hidden',
      numNeurons: 6,
      neurons: []
    },
    {
      type: 'output',
      numNeurons: dimInput,
      neurons: []
    }
  ];
  var weights = [];
  this.layers.forEach(function(layer, j) {
    var numNeurons = layer.numNeurons;
    for (var i = 0; i < numNeurons; i++) {
      var neuron = new Neuron(dimInput);
      layer.neurons.push(neuron);
      if (j) {
        weights.push.apply(weights, neuron.weights);
      }
    }
    dimInput = numNeurons;
  });
  this.weights = weights;
  this.processLayer = function(layer) {
    layer.outputs = layer.neurons.map(function(neuron, i) {
      neuron.processInputs(layer.inputs[i]);
      return neuron.output;
    });
  };
  this.processInputs = function(inputs) {
    this.inputs = inputs;
    var layers = this.layers;
    var inputLayer = layers[0];
    inputLayer.inputs = inputs;
    this.processLayer(inputLayer);
    for (var i = 1; i < layers.length; i++) {
      var layer = layers[i];
      layer.inputs = [];
      for (var j = 0; j < layer.numNeurons; j++){
        layer.inputs.push(layers[i - 1].outputs);
      }
      this.processLayer(layer);
    }
    this.outputs = layers[layers.length - 1].outputs;
  };

  this.encodeGenome = function() {
    this.layers.forEach(function(layer) {

    });
  };
};
