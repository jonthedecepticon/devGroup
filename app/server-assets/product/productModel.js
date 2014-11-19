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
  totalOrders: { type: Number, required: false, default: 0},
  currentOrders: { type: Number, required: false, default: 0}

});

/**
 * Statics
 */

Product.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      //.populate('user', 'name email')
      .populate('comments.user')
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      //.populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}


module.exports = mongoose.model('Product', Product);



