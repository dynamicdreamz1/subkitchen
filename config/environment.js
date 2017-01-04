/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    LOG_STRIPE_SERVICE: false,
    host: 'https://subkitchen-backend.herokuapp.com',
    apiEndpoint: '/api/v1',
    modulePrefix: 'subkitchen',
    podModulePrefix: 'subkitchen/pods',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    rollbar: {
      accessToken: '5400a056041743f4851251fe50935a97',
      // accessToken: '4cb8da362bad4db68daf4beca144bd29'
    },
    intl: {
      baseLocale: 'en-us',
      locales: ['en-us']
    },
    date: {
      defaultFormat: 'DD/MM/YYYY h:mm a',
      defaultDay: 'DD/MM/YYYY',
      defaultHour: 'h:mm a'
    },
    resizeServiceDefaults: {
      debounceTimeout    : 200,
      heightSensitive    : false,
      widthSensitive     : true
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.FB = {
    appId: '563204810504762',
    version: 'v2.5',
    xfbml: true
  };

  ENV.stripe = {
    publishableKey: 'pk_live_i6VlmcO16kg4wFMfcy264C6Q'
  };

  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:custom',
    crossOriginWhitelist: ['http://subkitchen-backend.herokuapp.com'],
    authenticationRoute: 'signin',
    routeAfterAuthentication: 'profile.info'
  };

  if (environment === 'development') {
    // ENV.host = 'http://localhost:3000';
    ENV.host = 'http://subkitchen-backend.herokuapp.com';
    ENV.FB.appId = '563205840504659';
    ENV.stripe.publishableKey = 'pk_test_h5Aqwd3kEZvC3496unFZclWC';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.host = 'http://localhost:3000';
    ENV.FB.appId = '563205840504659';
    ENV.stripe.publishableKey = 'pk_test_h5Aqwd3kEZvC3496unFZclWC';
  }

  if (environment === 'production') {

  }

  return ENV;
};
