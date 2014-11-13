'use strict';
var express = require('express');
var Session = require('express-session');
var port = 3000;	
var mongoose = require('mongoose');
var Product = require('./server-assets/product/productModel');
var routes = require('./server-assets/database');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./server-assets/user/userModel');

var db = 'mongodb://localhost/groupDropper';
var connection = mongoose.connection;



//express, bodyParser, cors setup
var app = express();
app.use(cors());
app.use(Session({
	secret: "whatevertheheckIwantontuesdayinjuly",
	name: 'DaProducts',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//ties in the index.html
app.use(express.static(__dirname + '/public'));


var user = {};
passport.use('facebook', new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID || '380054328825864',
 clientSecret: process.env.FACEBOOK_SECRET_ID || '348682659a6741a449c30aa77ee8a3aa',
 callbackURL: '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			User.findOne({facebookId: profile.id}, function(err, user){
			if(err) {console.log(err);}
			if(!err && user != null){
					done(null, user);
				} else {
					var newUser = new User();
					newUser.userName = profile._json.name;
			    newUser.facebookId = profile.id;
			    newUser.accountCreated = profile._json.updated_time;
			    newUser.save(function (err) {
			    	if(err){
			    	  console.log(err);
			    	} else {
			    		done(null, newUser);
			    	}
			    });
				}
			}); 
		});
}));


passport.serializeUser(function(user, done) {
console.log('serializing', user)
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id).exec(function(err, user){
		done(err, user);
	})

});

app.get('/auth/facebook',
	passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
 failureRedirect: '/#/login',
 successRedirect: '/#/products'
}));

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

//requests
app.get('/', routes.index);
app.get('/products', requireAuth, routes.products);
app.get('/products/:id', requireAuth, routes.product);
app.post('/products', requireAuth, routes.create);

mongoose.connect(db);
	connection.once('open', function () {
		console.log('Actually connected to our DB');


	app.listen(process.env.EXPRESS_PORT || 3000, function(){
		console.log('Connection Success on mongoDB & ' + 3000)
	});
})

