/**
 * Module dependencies.
 */
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var compress = require('compression');
var errorHandler = require('errorhandler');
var passport = require('passport');
var express = require('express');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');

var expressValidator = require('express-validator');
var path = require('path');
var _ = require('lodash');
var cloudinary = require('cloudinary');

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

/**
 * Cloudinary configuration.
 */
// cloudinary.config({ 
//   cloud_name: 'groupdropper', 
//   api_key: '357753245132285', 
//   api_secret: 'a676b67565c6767a6767d6767f676fe1' 
// });

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(express.logger('dev'));
app.locals.cacheBuster = Date.now();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(express.favicon());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, auto_reconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  var path = req.path.split('/')[1];
  if (/auth|login|logout|signup|fonts|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});
app.use(express.static(__dirname + '/public'), {maxAge: 864000000});


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
app.put('/products/:id', passportConf.isAuthenticated, routes.purchase);
app.post('/products', routes.create);

// app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


/**
 * API examples routes.
 */
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);

/**
 * OAuth sign-in routes.
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/#/products/', failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/#/products/', failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/#/products/', failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


/**
* Sample crud
*/
// app.get('/api/item', itemController.getItems);
// app.get('/api/item/:id', itemController.getItem);
// app.post('/api/item', itemController.postItem);
// app.delete('/api/item/:id', itemController.deleteItem);

/**
 * 500 Error Handler.
 */
app.use(express.errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port ' + app.get('port'));
});

module.exports = app;
