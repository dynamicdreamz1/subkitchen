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

  ENV['simple-auth'] = {
    store: 'simple-auth-session-store:local-storage',
    authorizer: 'authorizer:custom',
    crossOriginWhitelist: ['http://subkitchen-api.herokuapp.com'],
    routeAfterAuthentication: '/home'
  };

  if (environment === 'development') {
    ENV.host = 'http://localhost:3000';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
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
