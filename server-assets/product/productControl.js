var ProductModel = require('./productModel');
var Product = require('../models/Item');
var _ = require('underscore');

module.exports = {
	getProducts: function(req, res){
		ProductModel.find().exec(function(err, products){
			res.send(products);
		});
	},
	addProduct: function(req, res){
		var newProduct = new ProductModel(req.body);
		newProduct.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.status(200).send(req.body.title + ' was sucessfully added to your products list')
			}
		});
	},
}



/**
 * GET /item
 * List of API examples.
 */

exports.getItems = function(req, res) {
  var options = {};
  Item.list(options, function(err, data) {
	if (err)
		res.json('error', 500);
	else
		res.json(data);
	});
};

/**
 * GET /item/:id
 * List of API examples.
 */

exports.getItem = function(req, res) {
  Item.load(req.params.id, function(err, data) {
    if (err)
        res.json('Not found', 404);
    else
        res.json(data);
  });
};

/**
 * POST /item
 */
exports.postItem = function(req, res) {
	var c = new Item(req.body);
	c.user = req.user._id;
	c.save(function(err) {
		if (err) {
			res.json(err);
		}
		res.json(c);
	});
};

/**
 * PUT /item
 */
exports.putItem = function(req, res) {
	Item.load(req.params.id, function(err, data) {
		if (err)
			res.json('error', 500);
		else {
			data = _.union(data, req.body);
			data.save(function(err) {
				if (err) {
					res.json(err);
				}
				res.json(c);
			});
		}
	});
};


/**
 * DELETE /item/:id
 */
exports.deleteItem = function (req, res) {
  var id = req.params.id;

  Item.remove({_id: id}, function(err) {
        if (err)
                res.json("ERROR", 500);
        else {
                res.json("OK");
        }
  });
};
