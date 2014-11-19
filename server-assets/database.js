/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Product = require('./product/productModel');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./user/userModel');

/**
 * Mongoose configuration.
 */
mongoose.connection.on('error', function() {
  console.log('✗ MongoDB Connection Error. Please make sure MongoDB is running.'.red);
});
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
      console.log('ERRORRRRRRRRRRRRRRRR!!!')
      res.json({error:true});
    }
  });
};

module.exports.purchase = function(req, res){

  Product.findOne({_id: req.params.id}).exec(function(err, product){

    if(product){
      console.log(product.currentThreshold, 'Current');
      product.currentThreshold++;  // next price drop === product.peoplethreshold - product.currentThreshold
      product.totalOrders++;
      console.log(product.currentThreshold, 'Current Increased');
      if(product.peopleThreshold - product.currentThreshold <= 0 && (product.startingPrice - product.reductionAmount) < product.minimumPrice){
        console.log('price drop :)');
        product.currentThreshold = 0;
      }
      else if(product.peopleThreshold - product.currentThreshold <= 0){
        console.log('price drop :)');
        product.startingPrice -= product.reductionAmount;
        product.currentThreshold = 0;
      }

      product.save(function(err){
        if(err){
          console.log('This is NOT SAVING error: ' + err)
        } else {
          Product.find().exec(function (err, products) {
            res.send({products: products, product: product});
          })
        }
      })
    }
  })
}


// JSON API for creating a new product
module.exports.create = function(req, res) {
  console.log('req.body ' + JSON.stringify(req.body));
  // console.log(req.files.file)
  var reqBody = req.body,
  productObj = {
    productTitle: reqBody.productTitle,
    startingPrice: reqBody.startingPrice,
    minimumPrice: reqBody.minimumPrice,
    reductionAmount: reqBody.reductionAmount,
    peopleThreshold: reqBody.peopleThreshold,
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
