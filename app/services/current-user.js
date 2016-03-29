import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Service.extend({
  data: new Ember.Object(),
  session: Ember.inject.service('session'),

  init() {
    this._super(...arguments);
    this.fetchUser();
  },

  reload(){
    this.fetchUser();
  },

  fetchUser(){
    this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
      var headers = {};
      headers[headerName] = headerValue;
      Ember.$.ajax({
        headers: headers,
        method: "GET",
        url: config.host + config.apiEndpoint + '/account'
      }).then((result) => {
        this.set('data', result.user);
      }, () => {
        this.set('data', null);
      });
    });
  }
});
