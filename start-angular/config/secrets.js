module.exports = {
  db: 'localhost',

  sendgrid: {
    user: 'Your SendGrid Username',
    password: 'Your SendGrid Password'
  },

  nyt: {
    key: 'Your New York Times API Key'
  },

  lastfm: {
    api_key: 'Your API Key',
    secret: 'Your API Secret'
  },

  facebook: {
    clientID: '647578028693859',
    clientSecret: '46d50a8a8fee42545b101756595ec4da',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  github: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: 'yBndeFPtSoCyoww5qZET1k1iq',
    consumerSecret: 'b2gulvtzI1Pj0YdkRpFOKxuaHM4tNJiJm4WnEzOQrbp4YPhyMy',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: '417859851764-9kejrjpbclq5r00civomhl3ohso73i42.apps.googleusercontent.com',
    clientSecret: 'y8UM2jNdgit0ppPRsgbqqygb',

    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  tumblr: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    redirectUrl: 'http://localhost:3000/auth/foursquare/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com', // or api.paypal.com
    client_id: 'Your Client ID',
    client_secret: 'Your Client Secret',
    returnUrl: 'http://localhost:3000/api/paypal/success',
    cancelUrl: 'http://localhost:3000/api/paypal/cancel'
  }
};