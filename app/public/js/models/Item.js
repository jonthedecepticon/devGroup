var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  title: String,
  description: String
});

/**
 * Statics
 */

itemSchema.statics = {

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


module.exports = mongoose.model('Item', itemSchema);
