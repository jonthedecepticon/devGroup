var ProductModel = require('./productModel');

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