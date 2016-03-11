import Ember from 'ember';
import config from 'subkitchen-front/config/environment';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),

  toggleLike(id){
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
        var headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          method: "POST",
          url: config.host + config.apiEndpoint + '/products/' + id + '/toggle_like',
          dataType : 'json',
        })
        .then(function(result){
          resolve(result);
        }, function(error){
          reject(error);
        });
      });
    });
  }
});
