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
//ties in the index.html
app.use(express.static(__dirname + '/public'));

/**
 * Load controllers.
 */
var Product = require('./server-assets/product/productModel');
var routes = require('./server-assets/database');
var User = require('./server-assets/user/userModel');

/**
 * Application routes.
 */

app.get('/me', function (req, res) {

	return res.json(req.user);
})

app.get('/logout', function(req, res){
 req.logout();
 req.session.destroy();
 res.redirect('/');
});

var requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).end();
  }
  next();
};

app.get('/', routes.index);
app.get('/products', requireAuth, routes.products);
app.get('/products/:id', requireAuth, routes.product);
app.post('/products', requireAuth, routes.create);
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
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));



app.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port ' + app.get('port'));
});