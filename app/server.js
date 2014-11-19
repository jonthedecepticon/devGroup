'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var expressValidator = require('express-validator');
var Session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var Twit = require('twit');
var cloudinary = require('cloudinary');

var flash = require('express-flash');
var path = require('path');
var less = require('less-middleware');


/**
 * API keys + Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Mongoose configuration.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('✗ MongoDB Connection Error. Please make sure MongoDB is running.'.red);
});

var app = express();

cloudinary.config({ 
  cloud_name: 'groupdropper', 
  api_key: '357753245132285', 
  api_secret: 'a676b67565c6767a6767d6767f676fe1' 
});

/**
 * Express configuration.
 */
app.locals.cacheBuster = Date.now();
app.use(express.logger('dev'));
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'your secret code',
  store: new MongoStore({
    db: secrets.db
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(flash());
app.use(less({ src: __dirname + '/app/public', compress: true }));
app.use(express.static(path.join(__dirname + '/public'), {maxAge: 864000000}));
// app.use(function(req, res) {
//   res.render('404', { status: 404 });
// });
app.use(express.errorHandler());
app.use(app.router);


/**
 * Load controllers.
 */
var Product = require('./server-assets/product/productModel');
var routes = require('./server-assets/database');
var User = require('./server-assets/user/userModel');
var homeController = require('./server-assets/home/homeControl');
var apiController = require('./server-assets/api/apiControl');
// var itemController = require('./server-assets/product/itemControl');
var contactController = require('./server-assets/contact/contactControl');
var userController = require('./server-assets/user/userControl');

/**
 * Application routes.
 */
app.get('/', routes.index);
app.get('/products', routes.products);  
app.get('/products/:id', routes.product);
app.post('/products', routes.create);

app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


app.get('/', routes.index);
app.get('/products', routes.products);  
app.get('/products/:id', routes.product);
app.put('/products/:id', routes.purchase);
app.post('/products', routes.create);
// app.get('/', homeController.index);
// app.get('/login', userController.getLogin);
// app.post('/login', userController.postLogin);
// app.get('/logout', userController.logout);
// app.get('/signup', userController.getSignup);
// app.post('/signup', userController.postSignup);
// app.get('/contact', contactController.getContact);
// app.post('/contact', contactController.postContact);
// app.get('/account', passportConf.isAuthenticated, userController.getAccount);
// app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
// app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
// app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
// app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/#/products', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/#/products', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/#/products', failureRedirect: '/login' }));

/**
* Sample crud
*/
// app.get('/api/item', itemController.getItems);
// app.get('/api/item/:id', itemController.getItem);
// app.post('/api/item', itemController.postItem);
// app.delete('/api/item/:id', itemController.deleteItem);

app.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port ' + app.get('port'));
});