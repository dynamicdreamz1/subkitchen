/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    host: 'https://subkitchen-api.herokuapp.com',
    apiEndpoint: '/api/v1',
    modulePrefix: 'subkitchen-front',
    podModulePrefix: 'subkitchen-front/pods',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    date: {
      defaultFormat: 'DD/MM/YYYY h:mm a',
      defaultDay: 'DD/MM/YYYY',
      defaultHour: 'h:mm a'
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

  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:custom',
    crossOriginWhitelist: ['http://subkitchen-api.herokuapp.com'],
    authenticationRoute: 'signin',
    routeAfterAuthentication: 'index'
  };

  if (environment === 'development') {
    ENV.host = 'http://localhost:3000';
    ENV.FB.appId = '563205840504659';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
