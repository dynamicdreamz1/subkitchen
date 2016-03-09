import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import config from 'subkitchen-front/config/environment';

export default Base.extend({
  tokenEndpoint: config.host + '/api/v1/oauth/facebook',
  session: Ember.inject.service('session'),

  restore: function(data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate: function(options) {
    let that = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: this.tokenEndpoint,
        type: 'POST',
        data: JSON.stringify({
          access_token: options.access_token
        }),
        contentType: 'application/json;charset=utf-8',
        dataType: 'json'
      }).then(function(response) {
        Ember.run(function() {
          that.get('session').set('data.user', response);
          resolve({
            token: response.auth_token
          });
        });
      }, function(xhr) {
        var response = xhr.responseText;
        Ember.run(function() {
          reject(response);
        });
      });
    });
  },

  invalidate: function() {
    console.log('invalidate...');
    return Ember.RSVP.resolve();
  }
});
