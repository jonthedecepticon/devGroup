
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'groupDropper');
var Product = require('./product/productModel');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./user/userModel');
module.exports.index = function(req, res) {
  res.render('index', {title: 'Products'});
};


// JSON API for list of products
module.exports.products = function(req, res) { 
  Product.find().exec(function(error, products) {
    res.json(products);
  });
};
// JSON API for getting a single product
module.exports.product = function(req, res) {
  console.log(req.body)  
  var productId = req.params.id;
  Product.findById(productId, '', { lean: true }, function(err, product) {
    if(product) {
      var userVoted = false,
      userProductOption,
      totalVotes = 0;
      for(o in product.productOptions) {
        var productOption = product.productOptions[o]; 
        for(v in productOption.votes) {
          var vote = productOption.votes[v];
          totalVotes++;
          if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
            userVoted = true;
            userProductOption = { _id: productOption._id, text: productOption.text };
          }
        }
      }
      product.userVoted = userVoted;
      product.userProductOption = userProductOption;
      product.totalVotes = totalVotes;
      res.json(product);
    } else {
      res.json({error:true});
    }
  });
};
// JSON API for creating a new product
module.exports.create = function(req, res) {
  console.log(req.body)
  var reqBody = req.body,
  productObj = {
    productTitle: reqBody.productTitle,
    startingPrice: reqBody.startingPrice,
    minimumPrice: reqBody.minimumPrice,
    reductionAmount: reqBody.reductionAmount,
    peopleThreshold: reqBody.peopleThreshold,
    productPic: reqBody.productPic
  };
  var product = new Product(productObj);
  product.save(function(err, doc) {
    if(err || !doc) {
      throw 'Error' + err;
    } else {
      res.json(doc);
    }   
  });
};
