module.exports = {

  db: process.env.MONGOLAB_URI || process.env.MONGODB || 'mongodb://localhost:27017/GroupDropper',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },
  
  mandrill: {
    user: process.env.MANDRILL_USER || 'hackathonstarterdemo',
    password: process.env.MANDRILL_PASSWORD || 'E1K950_ydLR4mHw12a0ldA'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  nyt: {
    key: process.env.NYT_KEY || '9548be6f3a64163d23e1539f067fcabd:5:68537648'
  },

  lastfm: {
    api_key: process.env.LASTFM_KEY || 'c8c0ea1c4a6b199b3429722512fbd17f',
    secret: process.env.LASTFM_SECRET || 'is cb7857b8fba83f819ea46ca13681fe71'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '653358958106368',
    clientSecret: process.env.FACEBOOK_SECRET || 'bba4dadf8630415796f1e45d0da1860d',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  instagram: {
    clientID: process.env.INSTAGRAM_ID || '9f5c39ab236a48e0aec354acb77eee9b',
    clientSecret: process.env.INSTAGRAM_SECRET || '5920619aafe842128673e793a1c40028',
    callbackURL: '/auth/instagram/callback',
    passReqToCallback: true
  },

  github: {
    clientID: process.env.GITHUB_ID || 'cb448b1d4f0c743a1e36',
    clientSecret: process.env.GITHUB_SECRET || '815aa4606f476444691c5f1c16b9c70da6714dc6',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'yBndeFPtSoCyoww5qZET1k1iq',
    consumerSecret: process.env.TWITTER_SECRET  || 'b2gulvtzI1Pj0YdkRpFOKxuaHM4tNJiJm4WnEzOQrbp4YPhyMy',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: process.env.GOOGLE_ID || '991633117892-7o6g3h0d0bebdhcd9dd2hf452e5escop.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'Fwrww4dubmtilmI1NojASTVZ',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID || '77chexmowru601',
    clientSecret: process.env.LINKEDIN_SECRET || 'szdC8lN2s2SuMSy8',
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_fullprofile', 'r_emailaddress', 'r_network'],
    passReqToCallback: true
  },

  steam: {
    apiKey: process.env.STEAM_KEY || 'D1240DEF4D41D416FD291D0075B6ED3F'
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
    token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
  },

  clockwork: {
    apiKey: process.env.CLOCKWORK_KEY || '9ffb267f88df55762f74ba2f517a66dc8bedac5a'
  },

  stripe: {
    secretKey: process.env.STRIPE_SKEY || 'sk_test_BQokikJOvBiI2HlWgH4olfQ2',
    publishableKey: process.env.STRIPE_PKEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
  },

  tumblr: {
    consumerKey: process.env.TUMBLR_KEY || 'FaXbGf5gkhswzDqSMYI42QCPYoHsu5MIDciAhTyYjehotQpJvM',
    consumerSecret: process.env.TUMBLR_SECRET || 'QpCTs5IMMCsCImwdvFiqyGtIZwowF5o3UXonjPoNp4HVtJAL4o',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: process.env.FOURSQUARE_ID || '2STROLSFBMZLAHG3IBA141EM2HGRF0IRIBB4KXMOGA2EH3JG',
    clientSecret: process.env.FOURSQUARE_SECRET || 'UAABFAWTIHIUFBL0PDC3TDMSXJF2GTGWLD3BES1QHXKAIYQB',
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL || 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: process.env.VENMO_ID || '1688',
    clientSecret: process.env.VENMO_SECRET || 'uQXtNBa6KVphDLAEx8suEush3scX8grs',
    redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
  }
};

