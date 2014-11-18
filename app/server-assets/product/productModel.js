'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Product = new Schema({
	productTitle: { type: String, required: true, default: '' },
  startingPrice: { type: Number, required: true, default: 0 },
  minimumPrice: { type: Number, required: true, default: 0 },
  reductionAmount: { type: Number, default: 0 },
  peopleThreshold: { type: Number, default: 0 },
  currentThreshold: { type: Number, default: 0 },
  productPic: { type: String, required: false, default: '' },
  currentOrders: { type: Number, required: false, default: 0}

});

module.exports = mongoose.model('Product', Product);